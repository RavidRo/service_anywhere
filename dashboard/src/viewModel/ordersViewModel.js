import {changeOrderStatus, cancelOrder} from '../network/api';

export default class OrdersViewModel {
	constructor(ordersModel) {
		this.ordersModel = ordersModel;
	}
	get orders() {
		console.log('get orders view model');
		return this.ordersModel.orders;
	}

	set orders(orders) {
		this.ordersModel.setOrders(orders);
	}

	changeOrderStatus(orderId, newStatus) {
		if (changeOrderStatus(orderId, newStatus)) {
			this.ordersModel.changeOrderStatus(orderId, newStatus);
		}
	}

	cancelOrder(orderId) {
		if (cancelOrder(orderId)) {
			this.ordersModel.cancelOrder(orderId);
		}
	}
}
