import {makeAutoObservable} from 'mobx';
import {ItemIDO, OrderIDO, OrderStatus} from '../../../api';

export type assignedWaitersType = {orderId: string; waiterIds: string[]}[];

export default class ordersModel {
	_orders: OrderIDO[] = [];
	_items: ItemIDO[] = [];
	_assignedWaiters: assignedWaitersType = [];

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

	get assignedWaiters(): assignedWaitersType {
		return this._assignedWaiters;
	}

	set assignedWaiters(assignedWaiters: assignedWaitersType) {
		console.info('Setting assigned waiters');
		this._assignedWaiters = assignedWaiters;
	}

	updateAssignedWaiters(orderId: string, waiterIds: string[]): void {
		console.info('Updating assigned waiters with ', orderId, waiterIds);
		const assignedWaiterObject = this._assignedWaiters.find(
			entry => entry.orderId === orderId
		);
		if (assignedWaiterObject !== undefined) {
			assignedWaiterObject.waiterIds = waiterIds;
		} else {
			this._assignedWaiters.push({
				orderId: orderId,
				waiterIds: waiterIds,
			});
		}
		// const assigned = this._assignedWaiters;
		// this.assignedWaiters = assigned;
	}

	addOrder(order: OrderIDO) {
		console.log('Adding a new order', order);
		this._orders.push(order);
		// const orders = this._orders;
		// this.orders = orders;
	}

	changeOrderStatus(orderId: string, newStatus: OrderStatus) {
		this._orders.forEach(order => {
			if (order.id === orderId) {
				if (newStatus === 'delivered' || newStatus === 'canceled') {
					order.completionTime = new Date();
				}
				order.status = newStatus;
			}
		});

		// const orders = this._orders;
		// this.orders = orders;
		console.log(this.orders);
	}
}
