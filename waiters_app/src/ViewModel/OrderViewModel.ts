import {Location, OrderStatus} from '../ido';
import GuestsModel, {Guest} from '../Models/GuestsModel';
import Order from '../Models/Order';
import OrdersModel from '../Models/OrdersModel';
import Requests from '../networking/Requests';
import Singleton from '../Singleton';

export default class OrderViewModel extends Singleton {
	private requests: Requests;
	private ordersModel: OrdersModel;
	private guestsModel: GuestsModel;

	constructor(requests: Requests) {
		super();
		this.requests = requests;
		this.ordersModel = new OrdersModel();
		this.guestsModel = new GuestsModel();
	}

	public synchronizeOrders(): Promise<void> {
		return this.requests.getWaiterOrders().then(newOrders => {
			const orders = newOrders.map(order => new Order(order));
			this.ordersModel.orders = orders;
			this.guestsModel.guests = orders.map(
				order => new Guest(order.guestID)
			);
		});
	}

	get orders(): Order[] {
		return this.ordersModel.orders;
	}
	get guests(): Guest[] {
		return this.guestsModel.guests;
	}

	get availableOrders(): {order: Order; location: Location}[] {
		const guests = this.guestsModel.guests;
		return this.orders
			.map(order => {
				const guest = guests.find(guest => guest.id === order.guestID);
				return {order, location: guest?.location};
			})
			.filter(orderLocation => orderLocation.location) as {
			order: Order;
			location: Location;
		}[];
	}

	public updateGuestLocation(guestID: string, guestLocation: Location): void {
		this.guestsModel.updateGuestLocation(guestID, guestLocation);
	}

	public updateOrderStatus(orderID: string, status: OrderStatus): void {
		this.ordersModel.updateOrderStatus(orderID, status);
	}
}
