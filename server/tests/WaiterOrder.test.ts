import { ResponseMsg } from 'server/Response';
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
	const waiters: ResponseMsg<string[]> = WaiterOrder.getWaiterByOrder(order);
	expect(waiters.isSuccess())
	expect(waiters.getData().length).toBe(0);
});

test('get waiter order with our waiter should return nothing', () => {
	const orders: ResponseMsg<string[]> = WaiterOrder.getWaiterOrder(waiter);
	expect(orders.isSuccess())
	expect(orders.getData().length).toBe(0);
});

describe('assign a waiter to an order', () => {
	beforeAll(() => {
		WaiterOrder.assignWaiter(order, waiter);
	});

	test('get waiter by order with our order should return our waiter', () => {
		const waiters: ResponseMsg<string[]> = WaiterOrder.getWaiterByOrder(order);
		expect(waiters.isSuccess())
		expect(waiters.getData().length).toBe(1);
		expect(waiters.getData()[0]).toEqual(waiter);
	});

	test('get waiter order with our waiter should return our order', () => {
		const orders: ResponseMsg<string[]> = WaiterOrder.getWaiterOrder(waiter);
		expect(orders.isSuccess())
		expect(orders.getData().length).toBe(1);
		expect(orders.getData()[0]).toEqual(order);
	});
});
