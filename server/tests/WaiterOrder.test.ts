import {ResponseMsg} from '../Response';
import {Order} from '../Logic/Order';
import {WaiterOrder} from '../Logic/WaiterOrder';
import DashboardInterface from '../Interface/DashboardInterface';

let waiter: string;
let order: string;
let guestId: string;
let orderItems = new Map<string, number>([
	['bamba', 1],
	['beer', 2],
]);
beforeAll(() => {
	waiter = WaiterOrder.connectWaiter();
	guestId = 'guestId2';
	order = Order.createOrder(guestId, orderItems).getId();
});

test('connect waiter should return a waiter ID', () => {
	expect(waiter).toBeTruthy();
	expect(typeof waiter).toBe('string');
});

test('connect waiter should create unique waiter Ids', () => {
	expect(WaiterOrder.connectWaiter()).not.toBe(waiter);
});

test('get waiter by order with our order should return nothing', () => {
	const waiters: ResponseMsg<string[]> = WaiterOrder.getWaiterByOrder(order);
	expect(waiters.isSuccess());
	expect(waiters.getData()).toStrictEqual([]);
});

test('get waiter order with our waiter should return nothing', () => {
	const orders: ResponseMsg<string[]> = WaiterOrder.getWaiterOrder(waiter);
	expect(orders.isSuccess());
	expect(orders.getData()).toStrictEqual([]);
});

test('get guest order with our guestId should return our order', () => {
	expect(WaiterOrder.getGuestOrder(guestId).getData().guestId).toBe(guestId);
	expect(WaiterOrder.getGuestOrder(guestId).getData().id).toBe(order);
});

describe('assign a waiter to an order', () => {
	beforeAll(() => {
		DashboardInterface.changeOrderStatus(order, 'ready to deliver');
		WaiterOrder.assignWaiter([order], waiter);
	});

	test('get waiter by order with our order should return our waiter', () => {
		const waiters: ResponseMsg<string[]> =
			WaiterOrder.getWaiterByOrder(order);
		expect(waiters.isSuccess());
		expect(waiters.getData().length).toBe(1);
		expect(waiters.getData()[0]).toEqual(waiter);
	});

	test('get waiter order with our waiter should return our order', () => {
		const orders: ResponseMsg<string[]> =
			WaiterOrder.getWaiterOrder(waiter);
		expect(orders.isSuccess());
		expect(orders.getData().length).toBe(1);
		expect(orders.getData()[0]).toEqual(order);
	});
});
