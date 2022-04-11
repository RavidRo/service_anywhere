import GuestInterface from 'server/Interface/GuestInterface';
import ItemsInterface from 'server/Interface/ItemsInterface';
import {ResponseMsg} from 'server/Response';
import {OrderIDO} from 'api';

test('Creating order with not items returns a failure', () => {
	const items = ItemsInterface.getItems();

	const response1 = GuestInterface.createOrder('random id', new Map());

	const response2 = GuestInterface.createOrder(
		'random id',
		new Map([[items[0].id, 0]])
	);

	expect(response1.isSuccess()).toBeFalsy();
	expect(response2.isSuccess()).toBeFalsy();
});

test('Creating order with negative quantity fails', () => {
	const items = ItemsInterface.getItems();

	const response = GuestInterface.createOrder(
		'random id',
		new Map([[items[0].id, -5]])
	);

	expect(response.isSuccess()).toBeFalsy();
});

test('Creating order with items that does not exists fails', () => {
	const response = GuestInterface.createOrder(
		'random id',
		new Map([['random item', 5]])
	);
	expect(response.isSuccess()).toBeFalsy();
});

test('Getting the order of a guest with no order returns a failure', () => {
	const response = GuestInterface.getGuestOrder('random id');
	expect(response.isSuccess()).toBeFalsy();
});

test('Guests can get their order details', () => {
	const itemsList = ItemsInterface.getItems();
	const guestID = 'random id';
	const items = new Map([[itemsList[0].id, 5]]);

	GuestInterface.createOrder(guestID, items);

	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().guestId).toBe(guestID);
	expect(orderResponse.getData().items).toEqual(items);
});

test('Creating order with items with zero quantities removes them', () => {
	const itemsList = ItemsInterface.getItems();
	const guestID = 'random id';
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	GuestInterface.createOrder(guestID, items);

	const orderResponse = GuestInterface.getGuestOrder(guestID);

	const desiredItems = new Map([[itemsList[0].id, 5]]);
	expect(orderResponse.getData().items).toEqual(desiredItems);
});

test('Creating order sets it to the received status', () => {
	const itemsList = ItemsInterface.getItems();
	const guestID = 'random id';
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	GuestInterface.createOrder(guestID, items);

	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().status).toBe('received');
});

test('A new order does not have a termination time', () => {
	const itemsList = ItemsInterface.getItems();
	const guestID = 'random id';
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	GuestInterface.createOrder(guestID, items);

	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().terminationTime).toBeUndefined();
});

test("Creating an order returns the new order's id", () => {
	const itemsList = ItemsInterface.getItems();
	const guestID = 'random id';
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	const newOrderResponse = GuestInterface.createOrder(guestID, items);

	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().id).toBe(newOrderResponse.getData());
});

test("A guest with an active order can't create a new order", () => {
	const itemsList = ItemsInterface.getItems();
	const guestID = 'random id';
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	GuestInterface.createOrder(guestID, items);
	const create2Response = GuestInterface.createOrder(guestID, items);

	expect(create2Response.isSuccess()).toBeFalsy();
});
