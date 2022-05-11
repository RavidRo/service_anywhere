import Requests from 'guests_app/src/Networking/requests';
import Location, {Order, OrderID, OrderStatus} from 'guests_app/src/types';
import {OrderModel} from '../Model/OrderModel';

export default class OrderViewModel {
	private order_model;
	private requests;

	constructor(requests: Requests) {
		this.order_model = OrderModel.getInstance();
		this.requests = requests;
	}

	getOrderFromServer() {
		return this.requests
			.getGuestOrder()
			.then(order => {
				this.order_model.order = {
					id: order.id,
					items: order.items,
					status: order.status,
				};
			})
			.catch(error => {
				if (error.response.status == 404) {
					this.removeOrder();
					return Promise.resolve('no order');
				}
				return Promise.reject(error);
			});
	}

	createOrder(items: Object): Promise<Order> {
		if (!this.hasActiveOrder()) {
			return this.requests.createOrder(items).then(order_id => {
				const order: Order = {
					id: order_id,
					items: items,
					status: 'received',
				};
				this.order_model.order = order;
				console.log('created order = ', this.order_model.order);
				return order;
			});
		}
		return new Promise((_resolve, reject) =>
			reject('createOrder called when order already exists')
		);
	}

	cancelOrder(): Promise<void> {
		const order = this.getOrder();
		if (order != null) {
			return this.requests.cancelOrderGuest(order.id).then(() => {
				this.order_model.order = null;
			});
		}
		return new Promise((_resolve, reject) =>
			reject("cancelOrder called when order doesn't exists")
		);
	}

	submitReview(deatils: string, rating: Number): Promise<void> {
		const order = this.getOrder();
		if (order != null) {
			if (order.status === 'delivered') {
				return this.requests.submitReview(order.id, deatils, rating);
			}
			return new Promise((_resolve, reject) =>
				reject("cancelOrder called when order status isn't received")
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
	hasActiveOrder(): boolean {
		return this.order_model.hasActiveOrder();
	}
	getOrderStatus(): string {
		return this.order_model.getOrderStatus();
	}
	getOrderId(): OrderID {
		return this.order_model.getOrderId();
	}
	private removeOrder() {
		this.order_model.removeOrder();
	}
}
