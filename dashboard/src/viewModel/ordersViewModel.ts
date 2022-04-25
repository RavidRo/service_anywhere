import Api from '../network/api';
import OrderModel from '../model/ordersModel';
import {OrderIDO, OrderStatus} from '../../../api';
import Singleton from '../singleton';

export default class OrdersViewModel {
	private ordersModel: OrderModel;
	private api: Api;
	private firstTime: boolean;

	constructor(ordersModel: OrderModel, api: Api) {
		this.ordersModel = ordersModel;
		this.api = api;
		this.firstTime = true;
	}
	get orders(): OrderIDO[] {
		if (this.firstTime) {
			this.api
				.getOrders()
				.then(orders => (this.ordersModel.orders = orders));
			this.firstTime = false;
		}
		return this.ordersModel.orders;
	}

	set orders(orders: OrderIDO[]) {
		this.ordersModel.orders = orders;
	}

	changeOrderStatus(orderId: string, newStatus: OrderStatus) {
		this.api.changeOrderStatus(orderId, newStatus).then(() => {
			this.ordersModel.changeOrderStatus(orderId, newStatus);
			return true;
		});
		return false;
	}
}
