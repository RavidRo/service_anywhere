import Requests from 'guests_app/Networking/requests';
import {OrderModel} from '../Model/OrderModel';

type Location = {
	x: number;
	y: number;
};

type Item = {
	id: string;
	name: string;
	time: Number;
};
type LocalizationDetailsIDO = {};
export type Order = {
	id: OrderID;
	items: Map<string, Number>;
	status: OrderStatus;
};

type Arrived = boolean;
type OrderID = string;
type WaiterID = string;
type OrderStatus = 'a' | 'B'; // what status will we be on each system?

export default class OrderViewModel {
	private order_model = OrderModel.getInstance();
	private requests;
	constructor() {
		this.order_model = OrderModel.getInstance();
		this.requests = new Requests();
	} 

	createOrder(items: Map<string, Number>): Promise<OrderID> {
		return this.requests.createOrder(items)
		.then(order_id => {
			this.order_model.setOrder({
				id: order_id,
				items: items,
				status: 'recieved',
			});
			return order_id;
		});
	}

	// getItems!: () => Promise<[Item]>;
	// getMaps!: () => Promise<LocalizationDetailsIDO>; // LocalizationDetailsIDO ?
	// getMyOrders!: () => Promise<[Order]>;

	// submitReview!: (deatils: String, rating: Number) => Promise<void>;
	// cancelOrder!: (order_id: OrderID) => Promise<void>;
	// updateGuestLocation!: (location: Location, orderID: OrderID) => void;
}
