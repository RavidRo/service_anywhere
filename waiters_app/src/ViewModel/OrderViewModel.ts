import {Location, OrderStatus} from '../ido';
import GuestsModel, {Guest} from '../Models/GuestsModel';
import Order from '../Models/Order';
import OrdersModel from '../Models/OrdersModel';
import Requests from '../networking/Requests';
import Singleton from '../Singleton';
import {ItemViewModel} from './ItemViewModel';

export default class OrderViewModel extends Singleton {
	private requests: Requests;
	private ordersModel: OrdersModel;
	private guestsModel: GuestsModel;
	private itemViewModel: ItemViewModel;

	constructor(requests: Requests, itemViewModel: ItemViewModel) {
		super();
		this.requests = requests;
		this.ordersModel = new OrdersModel();
		this.guestsModel = new GuestsModel();
		this.itemViewModel = itemViewModel;
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
		return this.ordersModel.orders.map(order => {
			const rawItems = Object.entries(order.items);
			const allNamedItems: [string | undefined, number][] = rawItems.map(
				([id, quantity]) => [
					this.itemViewModel.getItemByID(id)?.name,
					quantity,
				]
			);
			const namedItems = allNamedItems.filter(
				([name, _]) => name !== undefined
			) as [string, number][];
			const items = Object.fromEntries(namedItems);
			return {...order, items};
		});
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

	public deliver(orderID: string) {
		return this.requests.delivered(orderID);
	}
}
