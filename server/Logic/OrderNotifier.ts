import {OrderStatus, Location, OrderIDO} from 'api';
import {IOrder} from './IOrder';
import {NotificationFacade} from './Notification/NotificationFacade';
import {Order} from './Order';
import config from '../config.json';
import {ResponseMsg} from '../Response';

export abstract class OrderNotifier extends IOrder {
	protected notificationFacade: NotificationFacade = new NotificationFacade();
	private order: IOrder;
	protected abstract receiverId: string;

	constructor(order: IOrder) {
		super();
		this.order = order;
	}

	static override createOrder(
		guestId: string,
		items: Map<string, number>
	): IOrder {
		const order = Order.createOrder(guestId, items);
		const orderGuest = new GuestNotifier(order, guestId);
		const orderDashboard = new DashboardNotifier(orderGuest);

		return orderDashboard;
	}

	override getId(): string {
		return this.order.getId();
	}

	override getGuestId(): string {
		return this.order.getGuestId();
	}

	override assign(waiterId: string): ResponseMsg<void> {
		return this.changeOrderStatus('assigned').then(() => {
			const orderWaiter = new WaiterNotifier(this.order, waiterId);
			this.order = orderWaiter;
		});
	}

	override updateGuestLocation(
		mapId: string,
		location: Location
	): ResponseMsg<void> {
		return this.order.updateGuestLocation(mapId, location);
	}

	override updateWaiterLocation(
		mapId: string,
		location: Location
	): ResponseMsg<void> {
		return this.order.updateWaiterLocation(mapId, location);
	}

	override changeOrderStatus(status: OrderStatus): ResponseMsg<void> {
		return this.order
			.changeOrderStatus(status)
			.then(() =>
				this.notificationFacade.changeOrderStatus(
					this.receiverId,
					this.getId(),
					status
				)
			);
	}

	override cancelOrder(): ResponseMsg<void> {
		return this.order
			.cancelOrder()
			.then(() =>
				this.notificationFacade.changeOrderStatus(
					this.receiverId,
					this.getId(),
					'canceled'
				)
			);
	}

	override giveFeedback(review: string, score: number): boolean {
		return this.order.giveFeedback(review, score);
	}

	override getDetails(): OrderIDO {
		return this.order.getDetails();
	}

	override orderArrived(): ResponseMsg<void> {
		return this.order.orderArrived();
	}

	override canAssign(): boolean {
		return this.order.canAssign();
	}

	override isActive(): boolean {
		return this.order.isActive();
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
			.then(() =>
				this.notificationFacade.updateWaiterLocation(
					this.receiverId,
					this.getId(),
					...params
				)
			);
	}

	override changeOrderStatus(status: OrderStatus): ResponseMsg<void> {
		return super
			.changeOrderStatus(status)
			.then(() =>
				this.notificationFacade.changeOrderStatus(
					this.receiverId,
					this.getId(),
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
			.then(() =>
				this.notificationFacade.updateGuestLocation(
					this.receiverId,
					this.getId(),
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
