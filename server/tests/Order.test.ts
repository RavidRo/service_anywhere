import {Order} from '../Logic/Order';
import {Location} from 'api';
import { IOrder } from 'server/Logic/IOrder';

let firstOrder: IOrder;
const guestId = 'guestId';
let beforeCreation: Date;
const orderItems = new Map<string,number>([['bamba', 1], ['beer', 2]]);
let afterCreation: Date;

beforeAll(() => {
	beforeCreation = new Date()
	firstOrder = Order.createOrder(guestId, orderItems)
	afterCreation = new Date()
});

test('createOrder should return an order with matching guest ID', () => {
	expect(firstOrder).toBeTruthy();
	expect(typeof firstOrder.getGuestId()).toBe('string');
	expect(firstOrder.getGuestId()).toBe(guestId);
	expect(typeof firstOrder.getDetails().guestId).toBe('string');
	expect(firstOrder.getDetails().guestId).toBe(guestId);
});

test('createOrder should return an order with matching items', () => {
	expect(firstOrder.getDetails().items).toBe(orderItems);
});

test('createOrder should return an order with a reasonable creation time', () => {
	expect(firstOrder.getDetails().creationTime.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
	expect(firstOrder.getDetails().creationTime.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
});

test('createOrder should return an order with a status of "received"', () => {
	expect(firstOrder.getDetails().status).toBe('received');
});

test("getId should return the order's id", () => {
	expect(firstOrder.getId()).toBe(firstOrder.getDetails().id);
});

test('createOrder should create unique order Ids', () => {
	expect(Order.createOrder('newGuest', orderItems).getId()).not.toBe(firstOrder.getId());
});

test('order arrival test', () => {
	Order.delegate(firstOrder.getId(), (o: IOrder) => {
		return o.orderArrived();
	});
	expect(
		firstOrder.getDetails().status
	).toBe('delivered')
});

test('delegate with a nonexistant orderId should fail', () => {
	expect(
		Order.delegate('', (o: IOrder) => {
			return o.assign('');
		}).isSuccess()
	).toBe(false);
});

test('cancelOrder should make the status "canceled"', () => {
	firstOrder.cancelOrderGuest()
	expect(
		firstOrder.getDetails().status
	).toBe('canceled');
});