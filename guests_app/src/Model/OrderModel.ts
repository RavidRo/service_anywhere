//import {makeAutoObservable} from 'mobx';
import {OrderStatus} from '../signatures';
import Singleton from '../Singeltone';
import Location, {Order, OrderID, Waiter} from '../types';

export class OrderModel extends Singleton {
	private _order: Order | null;
	private waiters: Waiter[];

	public constructor() {
		super();
		this._order = null;
		this.waiters = [];
		//	makeAutoObservable(this);
	}
	removeOrder() {
		this._order = null;
		this.waiters = [];
	}

	updateOrderStatus(orderID: OrderID, status: OrderStatus) {
		if (this._order != null && this.order?.id === orderID) {
			this._order.status = status;
		}
	}

	updateWaiterLocation(waiterId: string, waiterLocation: Location) {
		const waiter = this.waiters.find(waiter => waiter.id === waiterId);
		if (waiter) {
			waiter.location = waiterLocation;
		} else {
			this.waiters.push({id: waiterId, location: waiterLocation});
		}
	}

	getWaitersLocations() {
		return this.waiters.map(waiter => waiter.location);
	}
	getOrderId() {
		return this._order != null ? this._order.id : '';
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
