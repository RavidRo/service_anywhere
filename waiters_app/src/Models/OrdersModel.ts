import {makeAutoObservable} from 'mobx';
import {OrderStatus} from '../ido';
import Order from './Order';

export default class OrdersModel {
	private _orders: Map<string, Order>; //<ID, Object>
	constructor() {
		this._orders = new Map();
		makeAutoObservable(this);
	}

	get orders() {
		return Array.from(this._orders.values());
	}

	set orders(newOrders: Order[]) {
		this._orders.clear();
		newOrders.forEach(order => {
			this._orders.set(order.id, order);
		});
	}

	updateOrderStatus(orderID: string, status: OrderStatus): void {
		const order = this._orders.get(orderID);
		if (order) {
			order.orderStatus = status;
		}
	}
}
