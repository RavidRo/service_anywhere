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
		// const orders: any = [
		// 	{
		// 		id: '1',
		// 		items: new Map([
		// 			['a', 2],
		// 			['b', 3],
		// 		]),
		// 		status: 'received',
		// 		guestId: '1',
		// 		creationTime: new Date(),
		// 		terminationTime: new Date(),
		// 	},
		// 	{
		// 		id: '2',
		// 		items: new Map([
		// 			['c', 4],
		// 			['d', 5],
		// 		]),
		// 		status: 'delivered',
		// 		guestId: '2',
		// 		creationTime: new Date(),
		// 		terminationTime: new Date(),
		// 	},
		// ];
		// return Promise.resolve(orders);
	}

	getWaiters(): Promise<WaiterIDO[]> {
		return this.handler.get<WaiterIDO[]>('getWaiters');
	}

	assignWaiter(orderId: string, waiterId: string): Promise<void> {
		return this.handler.post<void>('assignWaiter', {
			orderId: orderId,
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
