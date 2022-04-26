import Api from '../network/api';
import OrderModel from '../model/ordersModel';
import {OrderIDO, OrderStatus} from '../../../api';
import Singleton from '../singleton';
import {Tune} from '@mui/icons-material';

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
		return this.api.getOrders().then(orders => {
			this.ordersModel.orders = orders;
		});
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
