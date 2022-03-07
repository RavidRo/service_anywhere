import Requests from 'guests_app/src/Networking/requests';
import Location, {Order, OrderID, OrderStatus} from 'guests_app/src/types';
import {OrderModel} from '../Model/OrderModel';

export default class OrderViewModel {
	private order_model;
	private requests;

	constructor(requests: Requests) {
		this.order_model = new OrderModel();
		this.requests = requests;
		this.getOrderFromServer();
	}

	getOrderFromServer() {
		this.requests.getMyOrders().then(orders => {
			if (orders.length > 0) {
				this.order_model.order = orders[0];
			} else {
				this.removeOrder();
			}
		});
	}

	createOrder(items: Map<string, Number>): Promise<Order> {
		if (this.getOrder() == null) {
			return this.requests.createOrder(items).then(order_id => {
				const order: Order = {
					id: order_id,
					items: items,
					status: 'recieved',
				};
				this.order_model.order = order;
				return order;
			});
		}
		return new Promise((_resolve, reject) =>
			reject('createOrder called when order already exists')
		);
	}

	cancelOrder(): Promise<boolean> {
		const order = this.getOrder();
		if (order != null) {
			return this.requests.cancelOrder(order.id).then(res => {
				if (res) {
					this.order_model.order = null;
					return true;
				}
				return false;
			});
		}
		return new Promise((_resolve, reject) =>
			reject("cancelOrder called when order doesn't exists")
		);
	}

	submitReview(deatils: string, rating: Number): Promise<void> {
		const order = this.getOrder();
		if (order != null) {
			if (order.status === 'arrived') {
				return this.requests.submitReview(order.id, deatils, rating);
			}
			return new Promise((_resolve, reject) =>
				reject("cancelOrder called when order status isn't arrived")
			);
		}
		return new Promise((_resolve, reject) =>
			reject("cancelOrder called when order doesn't exists")
		);
	}

	updateOrderStatus(orderID: OrderID, status: OrderStatus): void {
		this.order_model.updateOrderStatus(orderID, status);
	}

	updateWaiterLocation(waiterId: string, waiterLocation: Location): void {
		this.order_model.updateWaiterLocation(waiterId, waiterLocation);
	}

	getWaitersLocations(): Location[] {
		return this.order_model.getWaitersLocations();
	}
	
	getOrder() {
		return this.order_model.order;
	}
	hasActiveOrder(): boolean{
		return this.order_model.hasActiveOrder();
	}
	getOrderStatus(): string{
		return this.order_model.getOrderStatus();
	}
	getOrderId(): OrderID{
		return this.order_model.getOrderId();
	}
	private removeOrder() {
		this.order_model.removeOrder();
	}
}
