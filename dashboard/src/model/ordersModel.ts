import {makeAutoObservable} from 'mobx';
import {OrderIDO} from '../../../api';

export default class DashboardModel {
	_orders: OrderIDO[] = [
		{
			items: new Map([
				['a', 1],
				['b', 2],
			]),
			guestId: '0',
			creationTime: new Date(),
			terminationTime: new Date(),
			id: '1',
			status: 'received',
		},
		{
			items: new Map([
				['c', 3],
				['d', 4],
			]),
			guestId: '1',
			creationTime: new Date(),
			terminationTime: new Date(),
			id: '2',
			status: 'ready to deliver',
		},
	];

	constructor() {
		makeAutoObservable(this);
	}
	set orders(orders) {
		this._orders = orders;
	}

	get orders() {
		return this._orders;
	}

	changeOrderStatus(orderId, newStatus) {
		for (const order of this._orders) {
			if (order.id == orderId) {
				console.log('changing order to ' + newStatus);
				order['status'] = newStatus;
			}
		}
	}
}
