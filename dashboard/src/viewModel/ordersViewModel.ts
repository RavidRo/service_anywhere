import Api from '../network/api';
import OrderModel from '../model/ordersModel';
import {OrderIDO, OrderStatus} from '../../../api';

export default class OrdersViewModel {
	private ordersModel: OrderModel;
	private api: Api;

	constructor(ordersModel: OrderModel, api: Api) {
		console.log('Starting orders view model');
		this.ordersModel = ordersModel;
		this.api = api;
	}

	getOrders(): OrderIDO[] {
		return this.ordersModel.orders;
	}

	setOrders(orders: OrderIDO[]) {
		this.ordersModel.orders = orders;
	}

	updateOrder(order: OrderIDO[]) {
		this.ordersModel.orders = order;
	}

	synchroniseOrders(): Promise<void> {
		return this.api
			.getOrders()
			.then(orders => {
				console.info('Synchronized orders');
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
