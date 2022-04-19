import Api from '../network/api';
import OrderModel from '../model/ordersModel';
import {OrderIDO, OrderStatus} from '../../../api';

export default class OrdersViewModel {
	private ordersModel: OrderModel;
	private api: Api;

	constructor(ordersModel: OrderModel, api: Api) {
		this.ordersModel = ordersModel;
		this.api = api;
	}
	get orders(): OrderIDO[] {
		return this.ordersModel.orders;
	}

	set orders(orders: OrderIDO[]) {
		this.ordersModel.orders = orders;
	}

	changeOrderStatus(orderId: string, newStatus: OrderStatus) {
		if (this.api.changeOrderStatus(orderId, newStatus) === true) {
			this.ordersModel.changeOrderStatus(orderId, newStatus);
			return true;
		}
		return false;
	}
}
