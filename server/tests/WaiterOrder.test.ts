import {ResponseMsg} from '../Response';
import {WaiterOrder} from '../Logic/WaiterOrder';
import DashboardInterface from '../Interface/DashboardInterface';
import ItemsInterface from '../Interface/ItemsInterface';

import {IOrder} from '../Logic/IOrder';
import {AppDataSource} from '../Data/data-source';
import reset_all from '../Data/test_ResetDatabase';
// import {test_resetWaiters} from '../Data/Stores/WaiterStore';
// import {test_resetItems} from '../Data/Stores/ItemStore';

beforeAll(async () => {
	await AppDataSource.initialize();
});

beforeEach(async () => {
	await reset_all();
	// IOrder.test_deleteAllOrders();
	// WaiterOrder.getInstance().test_deleteAll();
	// test_resetWaiters();
	// test_resetItems();
});

const createOrder = async () => {
	const guestID = 'guestId2';

	const items = await ItemsInterface.getItems();
	const orderItems = new Map<string, number>([
		[items[0].id, 1],
		[items[1].id, 2],
	]);
	const orderID = (
		await WaiterOrder.getInstance().createOrder(guestID, orderItems)
	).getData();

	return {orderID, guestID};
};

test('get waiter by order with our order should return nothing', async () => {
	const {orderID} = await createOrder();
	const waiters: ResponseMsg<string[]> =
		await WaiterOrder.getInstance().getWaiterByOrder(orderID);
	expect(waiters.isSuccess()).toBeTruthy();
	expect(waiters.getData()).toStrictEqual([]);
});

test('get waiter order with our waiter should return nothing', async () => {
	const waitersIDs = (await DashboardInterface.getWaiters()).getData();
	const orders: ResponseMsg<string[]> =
		await WaiterOrder.getInstance().getOrdersByWaiter(waitersIDs[0]);
	expect(orders.isSuccess()).toBeTruthy();
	expect(orders.getData()).toStrictEqual([]);
});

test('get guest order with our guestId should return our order', async () => {
	const {orderID, guestID} = await createOrder();
	expect(
		WaiterOrder.getInstance().getGuestOrder(guestID).getData().guestId
	).toBe(guestID);
	expect(WaiterOrder.getInstance().getGuestOrder(guestID).getData().id).toBe(
		orderID
	);
});

test('get waiter by order with our order should return our waiter', async () => {
	const {orderID} = await createOrder();

	const waitersIDs = (await DashboardInterface.getWaiters()).getData();
	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');

	const waiterOrder = WaiterOrder.getInstance();
	await waiterOrder.assignWaiter([orderID], waitersIDs[0]);

	const waiters: ResponseMsg<string[]> = await waiterOrder.getWaiterByOrder(
		orderID
	);

	expect(waiters.isSuccess()).toBeTruthy();
	expect(waiters.getData().length).toBe(1);
	expect(waiters.getData()[0]).toEqual(waitersIDs[0]);
});

test('get waiter order with our waiter should return our order', async () => {
	const {orderID} = await createOrder();

	const waitersIDs = (await DashboardInterface.getWaiters()).getData();
	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');

	const waiterOrder = WaiterOrder.getInstance();

	await waiterOrder.assignWaiter([orderID], waitersIDs[0]);

	const orders: ResponseMsg<string[]> = await waiterOrder.getOrdersByWaiter(
		waitersIDs[0]
	);
	expect(orders.isSuccess()).toBeTruthy();
	expect(orders.getData().length).toBe(1);
	expect(orders.getData()[0]).toEqual(orderID);
});
