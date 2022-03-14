import {Order} from '../Logic/Order';
import {Location} from '../../api';

const order = require('../Logic/Order');

var firstOrder: string;

beforeAll(() => {
	firstOrder = order.Order.createOrder(['a', 'b']);
});

test('createOrder should return an order ID', () => {
	expect(firstOrder).toBeTruthy();
	expect(typeof firstOrder).toBe('string');
});

test('createOrder should create unique order Ids', () => {
	expect(order.Order.createOrder(['a', 'b'])).not.toBe(firstOrder);
});

test('giveFeedback should return true', () => {
	expect(
		order.Order.delegate(firstOrder, (o: Order) => {
			return o.giveFeedback('good', 5);
		}).isSuccess()
	).toBe(true);
});

test('updateLocationGuest and getGuestLocation should have corresponding locations', () => {
	var location: Location = {x: 1, y: 1};
	expect(
		order.Order.delegate(firstOrder, (o: Order) => {
			return o.updateLocationGuest(location);
		}).isSuccess()
	).toBe(true);
	expect(order.Order.getGuestLocation(firstOrder).getData()).toEqual(
		location
	);
});

test('order arrival test', () => {
	order.Order.delegate(firstOrder, (o: Order) => {
		o.orderArrived();
	});
	expect(
		order.Order.delegate(firstOrder, (o: Order) => {
			return o.hasOrderArrived();
		}).isSuccess()
	).toBe(true);
});

test('delegate with a nonexistant orderId should fail', () => {
	expect(
		order.Order.delegate('', (o: Order) => {
			return o.hasOrderArrived();
		}).isSuccess()
	).toBe(false);
});

test('getGuestLocation with a nonexistant orderId should fail', () => {
	expect(order.Order.getGuestLocation('').isSuccess()).toBe(false);
});
