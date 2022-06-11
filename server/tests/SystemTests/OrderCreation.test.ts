import {getGuests} from '../../Data/Stores/GuestStore';
import {AppDataSource} from '../../Data/data-source';
import reset_all from '../../Data/test_ResetDatabase';
import GuestInterface from '../../Interface/GuestInterface';
import ItemsInterface from '../../Interface/ItemsInterface';

beforeAll(async () => {
	jest.spyOn(console, 'error').mockImplementation(jest.fn());
	await AppDataSource.initialize();
});

beforeEach(async () => {
	await reset_all();
});

test('Creating order with not items returns a failure', async () => {
	const items = await ItemsInterface.getItems();
	const guests = await getGuests();
	const guestID = guests[0].id;

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
	const guests = await getGuests();
	const guestID = guests[0].id;

	const response = await GuestInterface.createOrder(
		guestID,
		new Map([[items[0].id, -5]])
	);

	expect(response.isSuccess()).toBeFalsy();
});

test('Creating order with items that does not exists fails', async () => {
	const guests = await getGuests();
	const guestID = guests[0].id;

	const response = await GuestInterface.createOrder(
		guestID,
		new Map([['random item', 5]])
	);
	expect(response.isSuccess()).toBeFalsy();
});

test('Getting the order of a guest with no order returns a failure', async () => {
	const guests = await getGuests();
	const guestID = guests[0].id;

	const response = await GuestInterface.getGuestOrder(guestID);
	expect(response.isSuccess()).toBeFalsy();
});

test('Guests can get their order details', async () => {
	const guests = await getGuests();
	const guestID = guests[0].id;

	const itemsList = await ItemsInterface.getItems();
	const items = new Map([[itemsList[0].id, 5]]);

	const createResponse = await GuestInterface.createOrder(guestID, items);
	const orderResponse = await GuestInterface.getGuestOrder(guestID);

	expect(createResponse.isSuccess()).toBeTruthy();
	expect(orderResponse.getData().guestID).toBe(guestID);
	expect(orderResponse.getData().items).toEqual(
		Object.fromEntries(items.entries())
	);
});

test('Creating order with items with zero quantities removes them', async () => {
	const guests = await getGuests();
	const guestID = guests[0].id;

	const itemsList = await ItemsInterface.getItems();
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	await GuestInterface.createOrder(guestID, items);

	const orderResponse = await GuestInterface.getGuestOrder(guestID);

	const desiredItems = {[itemsList[0].id]: 5};
	expect(orderResponse.getData().items).toEqual(desiredItems);
});

test('Creating order sets it to the received status', async () => {
	const guests = await getGuests();
	const guestID = guests[0].id;

	const itemsList = await ItemsInterface.getItems();
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	await GuestInterface.createOrder(guestID, items);

	const orderResponse = await GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().status).toBe('received');
});

test('A new order does not have a termination time', async () => {
	const guests = await getGuests();
	const guestID = guests[0].id;

	const itemsList = await ItemsInterface.getItems();
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	await GuestInterface.createOrder(guestID, items);

	const orderResponse = await GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().completionTime).toBeUndefined();
});

test("Creating an order returns the new order's id", async () => {
	const guests = await getGuests();
	const guestID = guests[0].id;

	const itemsList = await ItemsInterface.getItems();
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	const newOrderResponse = await GuestInterface.createOrder(guestID, items);

	const orderResponse = await GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().id).toBe(newOrderResponse.getData());
});

test("A guest with an active order can't create a new order", async () => {
	const guests = await getGuests();
	const guestID = guests[0].id;

	const itemsList = await ItemsInterface.getItems();
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	await GuestInterface.createOrder(guestID, items);
	const create2Response = await GuestInterface.createOrder(guestID, items);

	expect(create2Response.isSuccess()).toBeFalsy();
});
