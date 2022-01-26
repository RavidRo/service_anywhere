import {resolvePlugin} from '@babel/core';
import {createOrder} from '../communication/requests';
import {OrderModel} from '../Model/OrderModel';
import {} from '../communication/requests';

type Location = {
	x: number;
	y: number;
};

type Item = {
	id: String;
	name: String;
	time: Number;
};
type LocalizationDetailsIDO = {};
export type Order = {
	id: OrderID;
	items: Map<String, Number>;
	status: OrderStatus;
};

type Arrived = boolean;
type OrderID = string;
type WaiterID = string;
type OrderStatus = 'a' | 'B'; // what status will we be on each system?

export default class OrderViewModel {
	private order_model = OrderModel.getInstance();

	createOrder(items: Map<String, Number>): Promise<OrderID> {
		return createOrder(items).then(order_id => {
			this.order_model.setOrder({
				id: order_id,
				items: items,
				status: 'recieved',
			});
			return order_id;
		});
	}

	login(password: String): Promise<void> {
		return new Promise<void>((resolve, reject) => {});
	}

	// getItems!: () => Promise<[Item]>;
	// getMaps!: () => Promise<LocalizationDetailsIDO>; // LocalizationDetailsIDO ?
	// getMyOrders!: () => Promise<[Order]>;

	// submitReview!: (deatils: String, rating: Number) => Promise<void>;
	// cancelOrder!: (order_id: OrderID) => Promise<void>;
	// updateGuestLocation!: (location: Location, orderID: OrderID) => void;
}
