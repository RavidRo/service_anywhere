import Api from '../network/api';
import OrderModel from '../model/ordersModel';
import {
	GuestIDO,
	ItemIDO,
	OrderIDO,
	OrderStatus,
	ReviewIDO,
} from '../../../api';
import {alertViewModel, waitersViewModel} from '../context';

export default class OrdersViewModel {
	private ordersModel: OrderModel;
	private api: Api;

	constructor(ordersModel: OrderModel, api: Api) {
		console.log('Starting orders view model');
		this.ordersModel = ordersModel;
		this.api = api;
	}

	//-----------GETTERS--------------
	getOrders(): OrderIDO[] {
		return this.ordersModel.orders;
	}

	getItems(): ItemIDO[] {
		return this.ordersModel.items;
	}

	getReview(orderID: string): ReviewIDO | undefined {
		return this.ordersModel.orders.find(entry => entry.id === orderID)
			?.review;
	}

	getGuestDetails(guestID: string): GuestIDO | undefined {
		return this.ordersModel.getGuestDetails(guestID);
	}

	getItemName(itemId: string): string {
		const items = this.ordersModel.items;
		if (items.length === 0) {
			return itemId;
		}
		return items.filter(item => item.id === itemId)[0].name;
	}
	// -------------SETTERS----------------
	setOrders(orders: OrderIDO[]) {
		this.ordersModel.orders = orders;
	}

	setItems(items: ItemIDO[]) {
		this.ordersModel.items = items;
	}
	// -------------------UPDATES---------------------
	addOrder(order: OrderIDO) {
		this.ordersModel.addOrder(order);
		this.fetchGuestDetails([order.guestID]).catch(e => {
			console.warn("Could not fetch a guest's details", e);
		});
		this.updateAssignedWaiter(order.id, []);
	}

	addGuestError(orderID: string, errorMsg: string) {
		alertViewModel.addAlert(`${orderID} Error: ${errorMsg}`);
	}

	updateAssignedWaiter(orderID: string, waiterIds: string[]) {
		console.info('Updating orderID: ' + orderID, 'waiters ' + waiterIds);
		waitersViewModel.updateAssignedWaiters(orderID, waiterIds);
	}

	addReview(orderID: string, details: string, rating: number): void {
		this.ordersModel.addReview(orderID, details, rating);
	}

	changeOrderStatusNotification(orderID: string, newStatus: OrderStatus) {
		console.log(orderID, newStatus);
		if (
			newStatus !== 'assigned' &&
			newStatus !== 'on the way' &&
			newStatus !== 'delivered'
		) {
			console.log('Changing assigned waiters');
			this.updateAssignedWaiter(orderID, []);
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

	// ------------------SYNCHRONISE--------------------

	synchroniseOrders(): Promise<unknown> {
		return this.api
			.getOrders()
			.then(orders => {
				console.info('Synchronized orders');
				this.ordersModel.orders = orders;
				return Promise.all([
					waitersViewModel.synchroniseAssignedWaiters(orders),
					this.fetchGuestDetails(
						orders.map(order => order.guestID)
					).catch(e => {
						console.warn("Could not fetch a guest's details", e);
					}),
				]);
			})
			.catch(err =>
				alertViewModel.addAlert(
					'Could not get orders please reload, Error: ' + err
				)
			);
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

	fetchGuestDetails(guestIDs: string[]) {
		return this.api.getGuestsDetails(guestIDs).then(guestsDetails => {
			this.ordersModel.addGuestDetails(guestsDetails);
		});
	}
}
