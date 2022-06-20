import RequestsHandler from './RequestsHandler';
import {GuestIDO, ItemIDO, OrderIDO, ReviewIDO, WaiterIDO} from '../../../api';

export default class Requests {
	private handler: RequestsHandler;
	constructor() {
		this.handler = new RequestsHandler();
	}

	// ------------GET---------------------------
	getOrders(): Promise<OrderIDO[]> {
		console.log('Getting orders');
		return this.handler.get<OrderIDO[]>('getOrders');
	}

	getWaiters(): Promise<WaiterIDO[]> {
		return this.handler.get<WaiterIDO[]>('getWaiters');
	}

	getGuestsDetails(ids: string[]): Promise<GuestIDO[]> {
		if (ids.length === 0) {
			return Promise.resolve([]);
		}
		return this.handler.get('getGuestsDetails', {ids});
	}

	getWaitersByOrder(orderID: string): Promise<string[]> {
		return this.handler.get<string[]>('getWaitersByOrder', {
			orderID: orderID,
		});
	}

	getItems(): Promise<ItemIDO[]> {
		return this.handler.get<ItemIDO[]>('getItems');
	}

	getReviews(): Promise<ReviewIDO[]> {
		console.log('Getting reviews');
		return this.handler.get<ReviewIDO[]>('getReviews');
	}

	// ------------------POST-------------------------
	login(username: string, password: string): Promise<string> {
		return this.handler.post<string>('login', {
			username: username,
			password: password,
		});
	}
	assignWaiter(orderID: string, waiterIDs: string[]): Promise<void> {
		return this.handler.post<void>('assignWaiter', {
			orderID: orderID,
			waiterIDs: waiterIDs,
		});
	}

	changeOrderStatus(orderID: string, newStatus: string): Promise<void> {
		return this.handler.post<void>('changeOrderStatus', {
			orderID: orderID,
			newStatus: newStatus,
		});
	}

	cancelOrder(orderID: string): Promise<void> {
		return this.handler.post<void>('cancelOrder', {
			orderID: orderID,
		});
	}
}
