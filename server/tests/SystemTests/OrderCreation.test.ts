import {IOrder} from '../../Logic/IOrder';
import {WaiterOrder} from '../../Logic/WaiterOrder';
import GuestInterface from '../../Interface/GuestInterface';
import ItemsInterface from '../../Interface/ItemsInterface';
import {test_resetWaiters} from '../../Data/WaiterStore';
import {test_resetItems} from '../../Data/ItemStore';

beforeEach(() => {
	IOrder.test_deleteAllOrders();
	WaiterOrder.getInstance().test_deleteAll();
	test_resetWaiters();
	test_resetItems();
});

const guestID = 'guestID';

test('Creating order with not items returns a failure', async () => {
	const items = await ItemsInterface.getItems();

	const response1 = await GuestInterface.createOrder(guestID, new Map());

	const response2 = await GuestInterface.createOrder(
		guestID,
		new Map([[items[0].id, 0]])
	);

	expect(response1.isSuccess()).toBeFalsy();
	expect(response2.isSuccess()).toBeFalsy();
});

test('Creating order with negative quantity fails', async () => {
	const items = await ItemsInterface.getItems();

	const response = await GuestInterface.createOrder(
		guestID,
		new Map([[items[0].id, -5]])
	);

	expect(response.isSuccess()).toBeFalsy();
});

test('Creating order with items that does not exists fails', async () => {
	const response = await GuestInterface.createOrder(
		guestID,
		new Map([['random item', 5]])
	);
	expect(response.isSuccess()).toBeFalsy();
});

test('Getting the order of a guest with no order returns a failure', () => {
	const response = GuestInterface.getGuestOrder(guestID);
	expect(response.isSuccess()).toBeFalsy();
});

test('Guests can get their order details', async () => {
	const itemsList = await ItemsInterface.getItems();
	const items = new Map([[itemsList[0].id, 5]]);

	const createResponse = await GuestInterface.createOrder(guestID, items);
	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(createResponse.isSuccess()).toBeTruthy();
	expect(orderResponse.getData().guestId).toBe(guestID);
	expect(orderResponse.getData().items).toEqual(items);
});

test('Creating order with items with zero quantities removes them', async () => {
	const itemsList = await ItemsInterface.getItems();
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	await GuestInterface.createOrder(guestID, items);

	const orderResponse = GuestInterface.getGuestOrder(guestID);

	const desiredItems = new Map([[itemsList[0].id, 5]]);
	expect(orderResponse.getData().items).toEqual(desiredItems);
});

test('Creating order sets it to the received status', async () => {
	const itemsList = await ItemsInterface.getItems();
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	await GuestInterface.createOrder(guestID, items);

	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().status).toBe('received');
});

test('A new order does not have a termination time', async () => {
	const itemsList = await ItemsInterface.getItems();
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	await GuestInterface.createOrder(guestID, items);

	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().terminationTime).toBeUndefined();
});

test("Creating an order returns the new order's id", async () => {
	const itemsList = await ItemsInterface.getItems();
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	const newOrderResponse = await GuestInterface.createOrder(guestID, items);

	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().id).toBe(newOrderResponse.getData());
});

test("A guest with an active order can't create a new order", async () => {
	const itemsList = await ItemsInterface.getItems();
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	await GuestInterface.createOrder(guestID, items);
	const create2Response = await GuestInterface.createOrder(guestID, items);

	expect(create2Response.isSuccess()).toBeFalsy();
});
