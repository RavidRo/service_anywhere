import {makeAutoObservable} from 'mobx';
import {Order, OrderID, OrderStatus} from '../types';

export class OrderModel {
	
	private static instance: OrderModel;
	private _order: Order | null;
	
	private constructor() {
		this._order = null;
	//	makeAutoObservable(this);
	}

	public static getInstance(): OrderModel {
		if (!OrderModel.instance) {
			OrderModel.instance = new OrderModel();
		}

		return OrderModel.instance;
	}

	updateOrderStatus(status: OrderStatus) {
		if(this._order != null)
			this._order.status = status;
	}

	getOrderId(){
		return this._order != null? this._order.id : ''
	}
	get order() {
		return this._order;
	}

	set order(order: Order | null) {
		this._order = order;
	}
}
