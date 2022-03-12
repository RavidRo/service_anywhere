import {ResponseMsg} from 'server/Response';
import {Location, OrderIDO} from '../../api';
import {Order} from '../Logic/Order';

function createOrder(items: string[]): string {
	return Order.createOrder(items);
}

function updateLocationGuest(location: Location, orderId: string): void {
	Order.delegate(orderId, (order: Order) =>
		order.updateLocationGuest(location)
	);
}

function getGuestOrder(guestId: string): OrderIDO

export default {
	createOrder,
	updateLocationGuest,
};
