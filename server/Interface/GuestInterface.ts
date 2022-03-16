import {ResponseMsg} from 'server/Response';
import {Location, OrderIDO} from '../../api';
import {Order} from '../Logic/Order';
import {WaiterOrder} from '../Logic/WaiterOrder'

function createOrder(id: string, items: Map<string, number>): string {
	return WaiterOrder.createOrder(id, items);
}

function updateLocationGuest(guestId: string, location: Location): void {
	location;
	guestId;
	throw new Error('Method not implemented');
}

function getGuestOrder(guestId: string): OrderIDO {
	var m = new Map();
	var d = new Date();
	throw new Error('Method not implemented');
	return {
		id: '',
		guestId: guestId,
		items: m,
		status: 'received',
		creationTime: d,
		terminationTime: d,
	};
}

function submitReview(orderId: string, details: string, rating: number): void {
	orderId;
	details;
	rating;
	throw new Error('Method not implemented');
}

function cancelOrder(orderId: string): Boolean {
	orderId;
	throw new Error('Method not implemented');
}

export default {
	createOrder,
	updateLocationGuest,
	getGuestOrder,
	submitReview,
	cancelOrder,
};
