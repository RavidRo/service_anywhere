import {ResponseMsg} from 'server/Response';
import {Location, OrderIDO} from '../../api';
import {Order} from '../Logic/Order';
import {WaiterOrder} from '../Logic/WaiterOrder'

function createOrder(guestId: string, items: Map<string, number>): string {
	return WaiterOrder.createOrder(guestId, items);
}

function updateLocationGuest(guestId: string, location: Location): void {
	location;
	guestId;
	throw new Error('Method not implemented');
}

function getGuestOrder(guestId: string): OrderIDO {
	let m = new Map();
	let d = new Date();
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
