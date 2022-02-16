import {Location, OrderStatus} from '../ido';
import Order from '../Models/Order';
import OrderModel from '../Models/OrderModel';
import Requests from '../networking/Requests';
import Singleton from '../Singleton';

export default class OrdersViewModel extends Singleton {
	private requests: Requests;
	private ordersModel: OrderModel;

	constructor(requests: Requests) {
		super();
		this.requests = requests;
		this.ordersModel = new OrderModel();
	}

	public synchronizeOrders(id: string): Promise<void> {
		return this.requests.getWaiterOrders(id).then(newOrders => {
			const orders = newOrders.map(order => new Order(order));
			this.ordersModel.setOrders(orders);
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
