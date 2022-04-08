import {changeOrderStatus, cancelOrder} from '../network/api';
import OrderModel from '../model/ordersModel';
import {OrderStatus} from '../../../api';

export default class OrdersViewModel {
	private ordersModel: OrderModel;
	constructor(ordersModel: OrderModel) {
		this.ordersModel = ordersModel;
	}
	get orders() {
		return this.ordersModel.orders;
	}

	set orders(orders) {
		this.ordersModel.orders = orders;
	}

	changeOrderStatus(orderId: string, newStatus: OrderStatus) {
		if (changeOrderStatus(orderId, newStatus) === true) {
			this.ordersModel.changeOrderStatus(orderId, newStatus);
			return true;
		}
		return false;
	}
}
