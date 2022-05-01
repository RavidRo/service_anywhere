import {makeAutoObservable} from 'mobx';
import Location, {Order, OrderID, OrderStatus, Waiter} from '../types';

export class OrderModel {
	private _order: Order | null;
	private _waiters: Waiter[];

	private constructor() {
		this._order = null;
		this._waiters = [];
		makeAutoObservable(this);
	}
	static instance?: OrderModel;
	static getInstance(): OrderModel {
		if (!this.instance) {
			this.instance = new OrderModel();
		}
		return this.instance;
	}

	removeOrder() {
		this._order = null;
		this._waiters = [];
	}

	updateOrderStatus(orderID: OrderID, status: OrderStatus) {
		if (this._order != null && this._order?.id === orderID) {
			this._order.status = status;
		}
	}

	updateWaiterLocation(waiterId: string, waiterLocation: Location) {
		const waiter = this._waiters.find(waiter => waiter.id === waiterId);
		if (waiter) {
			waiter.location = waiterLocation;
		} else {
			this._waiters.push({id: waiterId, location: waiterLocation});
		}
	}

	getWaitersLocations() {
		return this._waiters.map(waiter => waiter.location);
	}
	getOrderId() {
		return this.order != null ? this.order.id : '';
	}
	getOrderStatus(): string {
		return this._order != null ? this._order.status : '';
	}
	hasActiveOrder(): boolean {
		return this._order != null;
	}

	get order() {
		return this._order;
	}

	set order(order: Order | null) {
		this._order = order;
	}
}
