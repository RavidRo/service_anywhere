import {Order} from '../Logic/Order';
import {WaiterOrder} from '../Logic/WaiterOrder';

let waiter: string;
let order: string;

beforeAll(() => {
	waiter = WaiterOrder.connectWaiter();
	order = Order.createOrder(['a', 'b']);
});

test('connect waiter should return a waiter ID', () => {
	expect(waiter).toBeTruthy();
	expect(typeof waiter).toBe('string');
});

test('connect waiter should create unique waiter Ids', () => {
	expect(WaiterOrder.connectWaiter()).not.toBe(waiter);
});

test('get waiter by order with our order should return nothing', () => {
	const waiters: string[] = WaiterOrder.getWaiterByOrder(order);
	expect(waiters.length).toBe(0);
});

test('get waiter order with our waiter should return nothing', () => {
	const orders: string[] = WaiterOrder.getWaiterOrder(waiter);
	expect(orders.length).toBe(0);
});

describe('assign a waiter to an order', () => {
	beforeAll(() => {
		WaiterOrder.assignWaiter(order, waiter);
	});

	test('get waiter by order with our order should return our waiter', () => {
		const waiters: string[] = WaiterOrder.getWaiterByOrder(order);
		expect(waiters.length).toBe(1);
		expect(waiters[0]).toEqual(waiter);
	});

	test('get waiter order with our waiter should return our order', () => {
		const orders: string[] = WaiterOrder.getWaiterOrder(waiter);
		expect(orders.length).toBe(1);
		expect(orders[0]).toEqual(order);
	});
});
