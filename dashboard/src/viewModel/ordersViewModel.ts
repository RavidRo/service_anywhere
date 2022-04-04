import {changeOrderStatus, cancelOrder} from '../network/api';
import OrderModel from '../model/ordersModel';

export default class OrdersViewModel {
	private ordersModel: OrderModel;
	constructor(ordersModel) {
		this.ordersModel = ordersModel;
	}
	get orders() {
		return this.ordersModel.orders;
	}

	set orders(orders) {
		this.ordersModel.orders = orders;
	}

	changeOrderStatus(orderId, newStatus) {
		if (changeOrderStatus(orderId, newStatus)) {
			this.ordersModel.changeOrderStatus(orderId, newStatus);
			return true;
		}
		return false;
	}
}
