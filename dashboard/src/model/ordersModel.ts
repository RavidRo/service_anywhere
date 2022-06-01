import {makeAutoObservable} from 'mobx';
import {ItemIDO, OrderIDO, OrderStatus, ReviewIDO} from '../../../api';

export type assignedWaitersType = {orderId: string; waiterIds: string[]}[];
export type orderReviews = {orderId: string; review: ReviewIDO}[];

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

	addReview(orderId: string, review: ReviewIDO): void {
		console.info('Updating reviews with ', orderId, review);
		this._reviews.push({orderId: orderId, review: review});
	}

	updateAssignedWaiters(orderId: string, waiterIds: string[]): void {
		console.info('Updating assigned waiters with ', orderId, waiterIds);
		const assignedWaiterObject = this._assignedWaiters.find(
			entry => entry.orderId === orderId
		);
		if (assignedWaiterObject !== undefined) {
			assignedWaiterObject.waiterIds = waiterIds;
		} else {
			this._assignedWaiters.push({
				orderId: orderId,
				waiterIds: waiterIds,
			});
		}
	}

	addOrder(order: OrderIDO) {
		console.log('Adding a new order', order);
		this._orders.push(order);
	}

	changeOrderStatus(orderId: string, newStatus: OrderStatus) {
		this._orders.forEach(order => {
			if (order.id === orderId) {
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
