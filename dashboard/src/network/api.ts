import RequestsHandler from './RequestsHandler';
import Singleton from '../singleton';
import {OrderIDO, WaiterIDO} from '../../../api';

export default class Api extends Singleton {
	private handler: RequestsHandler;
	constructor() {
		super();
		this.handler = new RequestsHandler();
	}

	login(password: string): Promise<string> {
		return this.handler.post<string>('login', {password: password});
	}

	getOrders(): Promise<OrderIDO[]> {
		console.log('Getting orders');
		return this.handler.get<OrderIDO[]>('getOrders');
	}

	getWaiters(): Promise<WaiterIDO[]> {
		return this.handler.get<WaiterIDO[]>('getWaiters');
	}

	assignWaiter(orderId: string, waiterId: string[]): Promise<void> {
		return this.handler.post<void>('assignWaiter', {
			orderIds: [orderId],
			waiterId: waiterId,
		});
	}

	getWaitersByOrder(orderId: string): Promise<string[]> {
		return this.handler.get<string[]>('getWaitersByOrder', {
			orderId: orderId,
		});
	}

	changeOrderStatus(orderId: string, newStatus: string): Promise<void> {
		return this.handler.post<void>('changeOrderStatus', {
			orderId: orderId,
			newStatus: newStatus,
		});
	}

	cancelOrder(orderId: string): Promise<void> {
		return this.handler.post<void>('cancelOrder', {
			orderId: orderId,
		});
	}
}
