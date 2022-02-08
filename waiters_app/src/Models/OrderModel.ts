import {makeAutoObservable} from 'mobx';
import {Location, OrderStatus} from '../ido';
import Order from './Order';

export default class OrderModel {
	private _orders: Map<string, Order>; //<ID, Object>
	constructor() {
		this._orders = new Map();
		makeAutoObservable(this);
	}

	get orders() {
		return Array.from(this._orders.values());
	}

	setOrders(newOrders: Order[]) {
		this._orders.clear();
		newOrders.forEach(order => {
			this._orders.set(order.id, order);
		});
	}

	setLocation(orderID: string, location: Location) {
		const order = this._orders.get(orderID);
		if (order) {
			order.location = location;
		}
	}

	updateGuestLocation(guestID: string, guestLocation: Location): void {
		this._orders.forEach(order => {
			if (order.guestID === guestID) {
				order.location = guestLocation;
			}
		});
	}
	updateOrderStatus(orderID: string, status: OrderStatus): void {
		const order = this._orders.get(orderID);
		if (order) {
			order.orderStatus = status;
		}
	}
}
