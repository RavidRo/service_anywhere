import {ResponseMsg} from '../Response';
import WaiterOrder from '../Logic/WaiterOrder';
import DashboardInterface from '../Interface/DashboardInterface';
import ItemsInterface from '../Interface/ItemsInterface';

import {AppDataSource} from '../Data/data-source';
import reset_all from '../Data/test_ResetDatabase';
import {getGuests} from '../Data/Stores/GuestStore';
import GuestInterface from '../Interface/GuestInterface';
import config from '../config.json';

const adminID = config['admin_id'];

beforeAll(async () => {
	jest.spyOn(console, 'error').mockImplementation(jest.fn());
	await AppDataSource.initialize();
});

beforeEach(async () => {
	await reset_all();
});

const createOrder = async ({index = 0, advance = true} = {}) => {
	const guests = await getGuests();
	const itemsList = await ItemsInterface.getItems();
	const guestID = guests[index].id;
	const items = new Map([[itemsList[0].id, 5]]);

	const createOrderResponse = await GuestInterface.createOrder(
		guestID,
		items
	);
	const orderID = createOrderResponse.getData();
	if (advance) {
		await DashboardInterface.changeOrderStatus(
			orderID,
			'ready to deliver',
			adminID
		);
	}

	return {orderID, guestID, items};
};

test('get waiter by order with our order should return nothing', async () => {
	const {orderID} = await createOrder();
	const waiters: ResponseMsg<string[]> = await WaiterOrder.getWaiterByOrder(
		orderID
	);
	expect(waiters.isSuccess()).toBeTruthy();
	expect(waiters.getData()).toStrictEqual([]);
});

test('get waiter order with our waiter should return nothing', async () => {
	const waitersIDs = (await DashboardInterface.getWaiters()).getData();
	const orders = await WaiterOrder.getOrdersByWaiter(waitersIDs[0].id);
	expect(orders.isSuccess()).toBeTruthy();
	expect(orders.getData()).toStrictEqual([]);
});

test('get waiter by order with our order should return our waiter', async () => {
	const {orderID} = await createOrder();

	const waitersIDs = (await DashboardInterface.getWaiters()).getData();
	await DashboardInterface.changeOrderStatus(
		orderID,
		'ready to deliver',
		adminID
	);

	await WaiterOrder.assignWaiter(orderID, [waitersIDs[0].id]);

	const waiters: ResponseMsg<string[]> = await WaiterOrder.getWaiterByOrder(
		orderID
	);

	expect(waiters.isSuccess()).toBeTruthy();
	expect(waiters.getData().length).toBe(1);
	expect(waiters.getData()[0]).toEqual(waitersIDs[0].id);
});

test('get waiter order with our waiter should return our order', async () => {
	const {orderID} = await createOrder();

	const waitersIDs = (await DashboardInterface.getWaiters()).getData();
	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver', adminID);

	await WaiterOrder.assignWaiter(orderID, [waitersIDs[0].id]);

	const orders = await WaiterOrder.getOrdersByWaiter(waitersIDs[0].id);
	expect(orders.isSuccess()).toBeTruthy();
	expect(orders.getData().length).toBe(1);
	expect(orders.getData()[0].id).toEqual(orderID);
});
