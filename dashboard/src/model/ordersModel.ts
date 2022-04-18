import {makeAutoObservable} from 'mobx';
import {OrderIDO, OrderStatus} from '../../../api';

export default class ordersModel {
	_orders: OrderIDO[] = [];

	constructor() {
		makeAutoObservable(this);
	}
	set orders(orders: OrderIDO[]) {
		this._orders = orders;
	}

	get orders(): OrderIDO[] {
		return this._orders;
	}

	changeOrderStatus(orderId: string, newStatus: OrderStatus) {
		for (const order of this._orders) {
			if (order.id === orderId) {
				console.log('changing order to ' + newStatus);
				order['status'] = newStatus;
			}
		}
	}
}
