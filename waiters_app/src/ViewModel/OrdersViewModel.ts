import {Location, OrderStatus} from '../ido';
import Order from '../Models/Order';
import OrderModel from '../Models/OrderModel';
import Requests from '../networking/requests';
import Singleton from '../Singleton';

export default class OrdersViewModel extends Singleton {
	private requests: Requests;
	private ordersModel: OrderModel;

	// for POC only -----
	private ordersIntervals: Record<string, NodeJS.Timer>;

	private getLocation(order: Order) {
		this.requests.getGuestLocation(order.id).then(location => {
			this.ordersModel.setLocation(order.id, location);
		});
	}
	// ------------------

	constructor() {
		super();
		this.requests = new Requests();
		this.ordersModel = new OrderModel();
		this.ordersIntervals = {};
	}

	public synchronizeOrders(id: string): Promise<void> {
		return this.requests.getWaiterOrders(id).then(newOrders => {
			const orders = newOrders.map(order => new Order(order));
			this.ordersModel.setOrders(orders);
			orders.forEach(order => {
				const interval = setInterval(
					() => this.getLocation(order),
					10000
				);
				this.ordersIntervals[order.id] = interval;
			});
		});
	}

	get orders(): Order[] {
		return this.ordersModel.orders;
	}

	get availableOrders(): Order[] {
		return this.orders.filter(order => order.location);
	}

	public updateGuestLocation(guestID: string, guestLocation: Location): void {
		this.ordersModel.updateGuestLocation(guestID, guestLocation);
	}

	public updateOrderStatus(orderID: string, status: OrderStatus): void {
		this.ordersModel.updateOrderStatus(orderID, status);
	}
}
