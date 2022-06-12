import Api from '../network/api';
import OrderModel from '../model/ordersModel';
import {ItemIDO, OrderIDO, OrderStatus, ReviewIDO} from '../../../api';
import {alertViewModel} from '../context';

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

	updateAssignedWaiter(orderID: string, waiterIds: string[]) {
		console.info('Updating orderID: ' + orderID, 'waiters ' + waiterIds);
		this.ordersModel.updateAssignedWaiters(orderID, waiterIds);
	}

	getReview(orderID: string): ReviewIDO | undefined {
		return this.ordersModel.reviews.find(entry => entry.orderID === orderID)
			?.review;
	}

	addReview(orderID: string, details: string, rating: number): void {
		this.ordersModel.addReview(orderID, details, rating);
	}

	getAssignedWaiters(orderID: string): string[] {
		console.info('Getting assigned waiters of ', orderID);
		const assignedWaiters = this.ordersModel.assignedWaiters;
		const assignedWaiter = assignedWaiters.find(
			entry => entry.orderID === orderID
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
						alertViewModel.addAlert(
							'Could not find waiter by order ' + err
						)
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
				alertViewModel.addAlert(
					'Could not get orders please reload, Error: ' + err
				)
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
				alertViewModel.addAlert(
					'Could not get orders please reload, Error: ' + err
				)
			);
	}
	changeOrderStatusNotification(orderID: string, newStatus: OrderStatus) {
		console.log(orderID, newStatus);
		if (
			newStatus !== 'assigned' &&
			newStatus !== 'on the way' &&
			newStatus !== 'delivered'
		) {
			console.log('Changing assigned waiters');
			this.ordersModel.updateAssignedWaiters(orderID, []);
		}
		this.ordersModel.changeOrderStatus(orderID, newStatus);
	}

	changeOrderStatus(
		orderID: string,
		newStatus: OrderStatus
	): Promise<boolean> {
		return this.api
			.changeOrderStatus(orderID, newStatus)
			.then(() => {
				this.ordersModel.changeOrderStatus(orderID, newStatus);
				return true;
			})
			.catch(() => false);
	}
}
