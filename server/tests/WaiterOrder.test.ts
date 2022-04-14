import {ResponseMsg} from '../Response';
import {WaiterOrder} from '../Logic/WaiterOrder';
import DashboardInterface from '../Interface/DashboardInterface';
import ItemsInterface from '../Interface/ItemsInterface';

import {IOrder} from '../Logic/IOrder';
import {test_resetWaiters} from '../Data/WaiterStore';
import {test_resetItems} from '../Data/ItemStore';

beforeEach(() => {
	IOrder.test_deleteAllOrders();
	WaiterOrder.getInstance().test_deleteAll();
	test_resetWaiters();
	test_resetItems();
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
		WaiterOrder.getInstance().getWaiterByOrder(orderID);
	expect(waiters.isSuccess());
	expect(waiters.getData()).toStrictEqual([]);
});

test('get waiter order with our waiter should return nothing', async () => {
	const waitersIDs = (await DashboardInterface.getWaiters()).getData();
	const orders: ResponseMsg<string[]> =
		WaiterOrder.getInstance().getWaiterOrder(waitersIDs[0]);
	expect(orders.isSuccess());
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

	const waiters: ResponseMsg<string[]> =
		waiterOrder.getWaiterByOrder(orderID);

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

	const orders: ResponseMsg<string[]> = waiterOrder.getWaiterOrder(
		waitersIDs[0]
	);
	expect(orders.isSuccess()).toBeTruthy();
	expect(orders.getData().length).toBe(1);
	expect(orders.getData()[0]).toEqual(orderID);
});
