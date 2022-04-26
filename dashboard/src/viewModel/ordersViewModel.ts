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

	synchroniseOrders(): Promise<void> {
		return this.api
			.getOrders()
			.then(orders => {
				this.ordersModel.orders = orders;
			})
			.catch(err =>
				alert('Could not get orders please reload, Error: ' + err)
			);
	}

	changeOrderStatus(
		orderId: string,
		newStatus: OrderStatus
	): Promise<boolean> {
		return this.api
			.changeOrderStatus(orderId, newStatus)
			.then(() => {
				this.ordersModel.changeOrderStatus(orderId, newStatus);
				return true;
			})
			.catch(() => false);
	}
}
