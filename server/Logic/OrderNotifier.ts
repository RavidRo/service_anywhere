import {OrderStatus, Location, OrderIDO} from 'api';
import config from '../config.json';
import {ResponseMsg} from '../Response';

import {OrderDAO} from '../Data/entities/Domain/OrderDAO';

import {IOrder} from './IOrder';
import {Order} from './Order';
import {NotificationFacade} from './Notification/NotificationFacade';

export abstract class OrderNotifier implements IOrder {
	protected notificationFacade: NotificationFacade = new NotificationFacade();
	private order: IOrder;
	protected abstract receiverId: string;

	constructor(order: IOrder) {
		this.order = order;
	}

	static async createNewOrder(
		guestID: string,
		items: Map<string, number>
	): Promise<ResponseMsg<IOrder>> {
		const orderResponse = await Order.createNewOrder(guestID, items);
		return orderResponse.ifGood(order => {
			const orderGuest = new GuestNotifier(order, guestID);
			const orderDashboard = new DashboardNotifier(orderGuest);

			const notification = new NotificationFacade();
			notification.newOrder(guestID, order.getDetails());
			notification.newOrder(config.admin_id, order.getDetails());

			return orderDashboard;
		});
	}

	static createOrder(orderDAO: OrderDAO): IOrder {
		const guestID = orderDAO.guest.id;

		const order = Order.createOrder(orderDAO);
		const orderGuest = new GuestNotifier(order, guestID);
		const orderDashboard = new DashboardNotifier(orderGuest);
		const orderNotified = orderDAO.waiters.reduce(
			(lastOrder: IOrder, waiter) =>
				new WaiterNotifier(lastOrder, waiter.id),
			orderDashboard
		);

		return orderNotified;
	}

	getID(): string {
		return this.order.getID();
	}
	getGuestId(): string {
		return this.order.getGuestId();
	}
	getDetails(): OrderIDO {
		return this.order.getDetails();
	}

	canAssign(): boolean {
		return this.order.canAssign();
	}
	isActive(): boolean {
		return this.order.isActive();
	}

	updateGuestLocation(location: Location): ResponseMsg<void> {
		return this.order.updateGuestLocation(location);
	}
	updateWaiterLocation(location: Location): ResponseMsg<void> {
		return this.order.updateWaiterLocation(location);
	}

	async assign(waiterID: string): Promise<ResponseMsg<void>> {	//todo: why no call to this.order.assign()?
		const oldStatus = this.getDetails().status;
		const newStatus = oldStatus === 'on the way' ? oldStatus : 'assigned';
		return (await this.changeOrderStatus(newStatus, true, true)).ifGood(
			() => {
				const orderWaiter = new WaiterNotifier(this.order, waiterID);
				this.order = orderWaiter;
				this.notificationFacade.assignedToOrder(
					waiterID,
					this.getDetails()
				);
			}
		);
	}

	async changeOrderStatus(
		status: OrderStatus,
		assigningWaiter: boolean,
		adminPrivileges: boolean
	): Promise<ResponseMsg<void>> {
		return (
			await this.order.changeOrderStatus(
				status,
				assigningWaiter,
				adminPrivileges
			)
		).ifGood(() =>
			this.notificationFacade.changeOrderStatus(
				this.receiverId,
				this.getID(),
				status
			)
		);
	}

	giveFeedback(review: string, score: number): boolean {
		return this.order.giveFeedback(review, score);
	}
}

class GuestNotifier extends OrderNotifier {
	protected receiverId: string;

	constructor(order: IOrder, guestID: string) {
		super(order);
		this.receiverId = guestID;
	}

	override updateWaiterLocation(
		...params: [location: Location]
	): ResponseMsg<void> {
		return super
			.updateWaiterLocation(...params)
			.ifGood(() =>
				this.notificationFacade.updateWaiterLocation(
					this.receiverId,
					this.getID(),
					...params
				)
			);
	}
}

class WaiterNotifier extends OrderNotifier {
	protected receiverId: string;

	constructor(order: IOrder, waiterID: string) {
		super(order);
		this.receiverId = waiterID;
	}

	override updateGuestLocation(
		...params: [location: Location]
	): ResponseMsg<void> {
		return super.updateGuestLocation(...params).ifGood(() => {
			this.notificationFacade.updateGuestLocation(
				this.receiverId,
				this.getGuestId(),
				...params
			);
		});
	}
}

class DashboardNotifier extends OrderNotifier {
	protected receiverId: string;

	constructor(order: IOrder) {
		super(order);
		this.receiverId = config.admin_id;
	}
}
