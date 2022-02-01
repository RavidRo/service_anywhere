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

	constructor(id: string) {
		super();
		this.requests = new Requests();
		this.ordersModel = new OrderModel();
		this.ordersIntervals = {};
		this.requests
			.getWaiterOrders(id)
			.then(newOrders => this.onNewOrders(newOrders));
	}

	private onNewOrders(ordersIdos: OrderIdo[]) {
		const orders = ordersIdos.map(order => new Order(order));
		this.ordersModel.setOrders(orders);
		orders.forEach(order => {
			const interval = setInterval(() => this.getLocation(order), 10000);
			this.ordersIntervals[order.id] = interval;
		});
	}

	get orders() {
		return this.ordersModel.orders;
	}

	get availableOrders() {
		return this.orders.filter(order => order.location);
	}
}
