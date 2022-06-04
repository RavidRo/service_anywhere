import Api from '../network/api';
import OrderModel from '../model/ordersModel';
import {ItemIDO, OrderIDO, OrderStatus, ReviewIDO} from '../../../api';

export default class OrdersViewModel {
	private ordersModel: OrderModel;
	private api: Api;

	constructor(ordersModel: OrderModel, api: Api) {
		console.log('Starting orders view model');
		this.ordersModel = ordersModel;
		this.api = api;
	}

	getOrders(): OrderIDO[] {
		return this.ordersModel.orders;
	}

	setOrders(orders: OrderIDO[]) {
		this.ordersModel.orders = orders;
	}

	updateOrder(order: OrderIDO) {
		this.ordersModel.addOrder(order);
		this.updateAssignedWaiter(order.id, []);
	}

	getItems(): ItemIDO[] {
		return this.ordersModel.items;
	}

	setItems(items: ItemIDO[]) {
		this.ordersModel.items = items;
	}

	updateAssignedWaiter(orderId: string, waiterIds: string[]) {
		console.info('Updating orderId: ' + orderId, 'waiters ' + waiterIds);
		this.ordersModel.updateAssignedWaiters(orderId, waiterIds);
	}

	getReview(orderId: string): ReviewIDO | undefined {
		return this.ordersModel.reviews.find(entry => entry.orderId === orderId)
			?.review;
	}

	addReview(orderId: string, review: ReviewIDO): void {
		this.ordersModel.addReview(orderId, review);
	}

	getAssignedWaiters(orderId: string): string[] {
		console.info('Getting assigned waiters of ', orderId);
		const assignedWaiters = this.ordersModel.assignedWaiters;
		const assignedWaiter = assignedWaiters.find(
			entry => entry.orderId === orderId
		);
		if (assignedWaiter !== undefined) {
			return assignedWaiter.waiterIds;
		}
		return [];
	}

	synchroniseAssignedWaiters(): Promise<void[]> {
		return Promise.all(
			this.ordersModel.orders.map((order: OrderIDO) =>
				this.api
					.getWaitersByOrder(order.id)
					.then((waiterIds: string[]) => {
						console.info('Synchronised assigned waiters ');
						this.ordersModel.updateAssignedWaiters(
							order.id,
							waiterIds
						);
					})
					.catch((err: string) =>
						alert('Could not find waiter by order ' + err)
					)
			)
		);
	}

	synchroniseOrders(): Promise<void | void[]> {
		return this.api
			.getOrders()
			.then(orders => {
				console.info('Synchronized orders');
				this.ordersModel.orders = orders;
				return this.synchroniseAssignedWaiters();
			})
			.catch(err =>
				alert('Could not get orders please reload, Error: ' + err)
			);
	}

	getItemName(itemId: string): string {
		const items = this.ordersModel.items;
		if (items.length === 0) {
			return itemId;
		}
		return items.filter(item => item.id === itemId)[0].name;
	}

	synchroniseItems(): Promise<void> {
		return this.api
			.getItems()
			.then(items => {
				console.info('Synchronized items');
				this.ordersModel.items = items;
			})
			.catch(err =>
				alert('Could not get orders please reload, Error: ' + err)
			);
	}
	changeOrderStatusNotification(orderId: string, newStatus: OrderStatus) {
		console.log(orderId, newStatus);
		if (
			newStatus !== 'assigned' &&
			newStatus !== 'on the way' &&
			newStatus !== 'delivered'
		) {
			console.log('Changing assigned waiters');
			this.ordersModel.updateAssignedWaiters(orderId, []);
		}
		this.ordersModel.changeOrderStatus(orderId, newStatus);
	}

	changeOrderStatus(
		orderId: string,
		newStatus: OrderStatus
	): Promise<boolean> {
		return this.api
			.changeOrderStatus(orderId, newStatus)
			.then(() => {
				this.ordersModel.changeOrderStatus(orderId, newStatus);
				return true;
			})
			.catch(() => false);
	}
}
