import {makeAutoObservable} from 'mobx';
import {ItemIDO, OrderIDO, OrderStatus, ReviewIDO} from '../../../api';

export type assignedWaitersType = {orderID: string; waiterIds: string[]}[];
export type orderReviews = {orderID: string; review: ReviewIDO}[];

export default class ordersModel {
	_orders: OrderIDO[] = [];
	_items: ItemIDO[] = [];
	_assignedWaiters: assignedWaitersType = [];
	_reviews: orderReviews = [];

	constructor() {
		console.log('Starting the order model');
		makeAutoObservable(this);
	}

	set reviews(orderReviews: orderReviews) {
		console.info('setting review to ', orderReviews);
		this._reviews = orderReviews;
	}

	get reviews(): orderReviews {
		return this._reviews;
	}

	set orders(orders: OrderIDO[]) {
		console.info('Setting orders to ', orders);
		this._orders = orders;
	}

	get orders(): OrderIDO[] {
		console.info('getting orders');
		return this._orders;
	}

	set items(items: ItemIDO[]) {
		console.info('Setting orders to ', items);
		this._items = items;
	}

	get items(): ItemIDO[] {
		console.info('getting items');
		return this._items;
	}

	get assignedWaiters(): assignedWaitersType {
		return this._assignedWaiters;
	}

	set assignedWaiters(assignedWaiters: assignedWaitersType) {
		console.info('Setting assigned waiters');
		this._assignedWaiters = assignedWaiters;
	}

	addReview(orderID: string, details: string, rating: number): void {
		console.info('Updating reviews with ', orderID, details, rating);
		this._reviews.push({
			orderID: orderID,
			review: {details: details, rating: rating},
		});
	}

	updateAssignedWaiters(orderID: string, waiterIds: string[]): void {
		console.info('Updating assigned waiters with ', orderID, waiterIds);
		const assignedWaiterObject = this._assignedWaiters.find(
			entry => entry.orderID === orderID
		);
		if (assignedWaiterObject !== undefined) {
			assignedWaiterObject.waiterIds = waiterIds;
		} else {
			this._assignedWaiters.push({
				orderID: orderID,
				waiterIds: waiterIds,
			});
		}
	}

	addOrder(order: OrderIDO) {
		console.log('Adding a new order', order);
		this._orders.push(order);
	}

	changeOrderStatus(orderID: string, newStatus: OrderStatus) {
		this._orders.forEach(order => {
			if (order.id === orderID) {
				if (newStatus === 'delivered' || newStatus === 'canceled') {
					order.completionTime = new Date();
				}
				order.status = newStatus;
			}
		});

		// const orders = this._orders;
		// this.orders = orders;
		console.log(this.orders);
	}
}
