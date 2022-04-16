import {OrderStatus, Location, OrderIDO} from 'api';
import {IOrder} from './IOrder';
import {NotificationFacade} from './Notification/NotificationFacade';
import {Order} from './Order';
import config from '../config.json';
import {ResponseMsg} from '../Response';
import {OrderDAO} from '../Data/entities/Domain/OrderDAO';

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

	updateGuestLocation(mapId: string, location: Location): ResponseMsg<void> {
		return this.order.updateGuestLocation(mapId, location);
	}
	updateWaiterLocation(mapId: string, location: Location): ResponseMsg<void> {
		return this.order.updateWaiterLocation(mapId, location);
	}

	async assign(waiterId: string): Promise<ResponseMsg<void>> {
		return (await this.changeOrderStatus('assigned')).ifGood(() => {
			const orderWaiter = new WaiterNotifier(this.order, waiterId);
			this.order = orderWaiter;
		});
	}

	async changeOrderStatus(status: OrderStatus): Promise<ResponseMsg<void>> {
		return (await this.order.changeOrderStatus(status)).ifGood(() =>
			this.notificationFacade.changeOrderStatus(
				this.receiverId,
				this.getID(),
				status
			)
		);
	}

	async cancelOrder(): Promise<ResponseMsg<void>> {
		return (await this.order.cancelOrder()).ifGood(() =>
			this.notificationFacade.changeOrderStatus(
				this.receiverId,
				this.getID(),
				'canceled'
			)
		);
	}

	async orderArrived(): Promise<ResponseMsg<void>> {
		return this.order.orderArrived();
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
		this.notificationFacade.newOrder(this.receiverId, this.getDetails());
	}

	override updateWaiterLocation(
		...params: [mapID: string, location: Location]
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

	override async changeOrderStatus(
		status: OrderStatus
	): Promise<ResponseMsg<void>> {
		return (await super.changeOrderStatus(status)).ifGood(() =>
			this.notificationFacade.changeOrderStatus(
				this.receiverId,
				this.getID(),
				status
			)
		);
	}
}

class WaiterNotifier extends OrderNotifier {
	protected receiverId: string;

	constructor(order: IOrder, waiterID: string) {
		super(order);
		this.receiverId = waiterID;
		this.notificationFacade.assignedToOrder(
			this.receiverId,
			this.getDetails()
		);
	}

	override updateGuestLocation(
		...params: [mapID: string, location: Location]
	): ResponseMsg<void> {
		return super
			.updateGuestLocation(...params)
			.ifGood(() =>
				this.notificationFacade.updateGuestLocation(
					this.receiverId,
					this.getID(),
					...params
				)
			);
	}
}

class DashboardNotifier extends OrderNotifier {
	protected receiverId: string;

	constructor(order: IOrder) {
		super(order);
		this.receiverId = config.admin_id;
		this.notificationFacade.newOrder(this.receiverId, this.getDetails());
	}
}
