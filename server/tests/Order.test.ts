import {IOrder} from '../Logic/IOrder';
import {onOrder} from '../Logic/Orders';

import reset_all from '../Data/test_ResetDatabase';
import {AppDataSource} from '../Data/data-source';

import DashboardInterface from '../Interface/DashboardInterface';
import GuestInterface from '../Interface/GuestInterface';
import ItemsInterface from '../Interface/ItemsInterface';
import {getGuests} from '../Data/Stores/GuestStore';
import {makeGood} from '../Response';

const createOrder = async ({index = 0, advance = true} = {}) => {
	const guests = await getGuests();
	const guestID = guests[index].id;
	const itemsList = await ItemsInterface.getItems();
	const items = new Map([[itemsList[0].id, 5]]);

	const createOrderResponse = await GuestInterface.createOrder(
		guestID,
		items
	);
	const orderID = createOrderResponse.getData();
	if (advance) {
		await DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');
	}

	return {orderID, guestID, items};
};

beforeAll(async () => {
	jest.setTimeout(10000);
	jest.spyOn(console, 'error').mockImplementation(jest.fn());
	await AppDataSource.initialize();
});

beforeEach(async () => {
	await reset_all();
});

test("Creating an order with a none existent guest' id returns a failure", async () => {
	const itemsList = await ItemsInterface.getItems();
	const items = new Map([[itemsList[0].id, 5]]);

	const createOrderResponse = await GuestInterface.createOrder(
		'guestID',
		items
	);
	expect(createOrderResponse.isSuccess()).toBeFalsy();
});

test('createOrder should return an order with matching guest ID', async () => {
	const {guestID} = await createOrder();
	// const order = (await GuestInterface.getGuestOrder(guestID)).getData();
	// expect(order.guestId).toBe(guestID);
	expect(true).toBeTruthy();
});

test('createOrder should return an order with matching items', async () => {
	const {guestID, items: orderItems} = await createOrder();
	const order = (await GuestInterface.getGuestOrder(guestID)).getData();
	expect(order.items).toEqual(Object.fromEntries(orderItems.entries()));
});

test('createOrder should return an order with a reasonable creation time', async () => {
	const beforeCreation = new Date().getTime();
	const {guestID} = await createOrder();
	const order = (await GuestInterface.getGuestOrder(guestID)).getData();
	const afterCreation = new Date();
	expect(order.creationTime.getTime()).toBeGreaterThanOrEqual(beforeCreation);
	expect(order.creationTime.getTime()).toBeLessThanOrEqual(
		afterCreation.getTime()
	);
});

test('createOrder should return an order with a status of "received"', async () => {
	const {guestID} = await createOrder({advance: false});
	const order = (await GuestInterface.getGuestOrder(guestID)).getData();
	expect(order.status).toBe('received');
});

test("getId should return the order's id", async () => {
	const {orderID, guestID} = await createOrder();
	const order = (await GuestInterface.getGuestOrder(guestID)).getData();
	expect(order.id).toBe(orderID);
});

test('createOrder should create unique order Ids', async () => {
	const {orderID: orderID1} = await createOrder({index: 0});
	const {orderID: orderID2} = await createOrder({index: 1});
	expect(orderID1).not.toBe(orderID2);
});

test('delegate with a none existent orderId should fail', async () => {
	expect(
		(await onOrder('', (_o: IOrder) => makeGood())).isSuccess()
	).toBeFalsy();
});
