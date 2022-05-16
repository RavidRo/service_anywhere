import {makeAutoObservable} from 'mobx';
import {ItemIDO, OrderIDO, OrderStatus} from '../../../api';

export default class ordersModel {
	_orders: OrderIDO[] = [];
	_items: ItemIDO[] = [];

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

	set items(items: ItemIDO[]) {
		console.info('Setting orders to ', items);
		this._items = items;
	}

	get items(): ItemIDO[] {
		console.info('getting items');
		return this._items;
	}

	addOrder(order: OrderIDO) {
		console.log('Adding a new order', order);
		this._orders.push(order);
		const orders = this._orders;
		this.orders = orders;
	}
	changeOrderStatus(orderId: string, newStatus: OrderStatus) {
		this._orders.forEach(order => {
			if (order.id === orderId) {
				order.status = newStatus;
			}
		});
		const orders = this._orders;
		this.orders = orders;
		console.log(this.orders);
	}
}
