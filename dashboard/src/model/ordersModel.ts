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
		console.log(this._orders);
		return this._orders;
	}

	cancelOrder(orderId) {
		alert(`not implemented, orderId: ${orderId}`);
	}

	changeOrderStatus(orderId, newStatus) {
		alert(`not implemented, orderId: ${orderId}, newStatus: ${newStatus}`);
	}
}
