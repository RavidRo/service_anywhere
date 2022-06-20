import {makeAutoObservable} from 'mobx';
import {GuestIDO, ItemIDO, OrderIDO, OrderStatus} from '../../../api';

// export type assignedWaitersType = {orderID: string; waiterIds: string[]}[];
// export type orderReviews = {orderID: string; review: ReviewIDO}[];

export default class ordersModel {
	_orders: OrderIDO[] = [];
	_items: ItemIDO[] = [];
	// _reviews: orderReviews = [];
	_guestDetails: GuestIDO[] = [];

	constructor() {
		console.log('Starting the order model');
		makeAutoObservable(this);
	}

	// ----------orders--------------
	set orders(orders: OrderIDO[]) {
		console.info('Setting orders to ', orders);
		this._orders = orders;
	}

	get orders(): OrderIDO[] {
		console.info('getting orders');
		return this._orders;
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
		console.log(this.orders);
	}

	//  ---------reviews------------------

	addReview(orderID: string, details: string, rating: number): void {
		console.info('Updating reviews with ', orderID, details, rating);
		this._orders.forEach(order => {
			if (order.id === orderID) {
				order.review = {details: details, rating: rating};
			}
		});
	}
	//  ------------items--------------
	set items(items: ItemIDO[]) {
		console.info('Setting orders to ', items);
		this._items = items;
	}

	get items(): ItemIDO[] {
		console.info('getting items');
		return this._items;
	}

	// ----------guest details----------------------
	set guestDetails(guestDetails: GuestIDO[]) {
		console.info('setting guest details to ', guestDetails);
		this._guestDetails = guestDetails;
	}

	get guestDetails(): GuestIDO[] {
		return this._guestDetails;
	}

	addGuestDetails(guestDetails: GuestIDO[]) {
		console.info('adding guest details', guestDetails);
		guestDetails.forEach(details => this._guestDetails.push(details));
	}

	getGuestDetails(guestID: string): GuestIDO | undefined {
		return this._guestDetails.find(details => details.id === guestID);
	}
}
