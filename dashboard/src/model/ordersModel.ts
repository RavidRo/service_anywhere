import {makeAutoObservable} from 'mobx';
import {OrderIDO, OrderStatus} from '../../../api';

export default class ordersModel {
	_orders: OrderIDO[] = [];

	constructor() {
		console.log('Starting the order model');
		makeAutoObservable(this);
	}
	set orders(orders: OrderIDO[]) {
		console.info('Setting orders to ', orders);
		this._orders = orders;
	}

	get orders(): OrderIDO[] {
		console.info('getting orders');
		return this._orders;
	}

	addOrder(order: OrderIDO) {
		console.log('Adding a new order', order);
		this._orders.push(order);
		const orders = this._orders;
		this.orders = orders;
	}
	changeOrderStatus(orderId: string, newStatus: OrderStatus) {
		for (const order of this._orders) {
			if (order.id === orderId) {
				console.info('changing order to ' + newStatus);
				order['status'] = newStatus;
			}
		}
	}
}
