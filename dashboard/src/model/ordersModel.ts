import {makeAutoObservable} from 'mobx';
import {
	GuestIDO,
	ItemIDO,
	OrderIDO,
	OrderStatus,
	ReviewIDO,
} from '../../../api';

// export type assignedWaitersType = {orderID: string; waiterIds: string[]}[];
export type orderReviews = {orderID: string; review: ReviewIDO}[];

export default class ordersModel {
	_orders: OrderIDO[] = [];
	_items: ItemIDO[] = [];
	// _assignedWaiters: assignedWaitersType = [];
	_reviews: orderReviews = [];
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

		// const orders = this._orders;
		// this.orders = orders;
		console.log(this.orders);
	}
	// ------------assigned waiters---------------
	// get assignedWaiters(): assignedWaitersType {
	// 	return this._assignedWaiters;
	// }

	// set assignedWaiters(assignedWaiters: assignedWaitersType) {
	// 	console.info('Setting assigned waiters');
	// 	this._assignedWaiters = assignedWaiters;
	// }

	// updateAssignedWaiters(orderID: string, waiterIds: string[]): void {
	// 	console.info('Updating assigned waiters with ', orderID, waiterIds);
	// 	const assignedWaiterObject = this._assignedWaiters.find(
	// 		entry => entry.orderID === orderID
	// 	);
	// 	if (assignedWaiterObject !== undefined) {
	// 		assignedWaiterObject.waiterIds = waiterIds;
	// 	} else {
	// 		this._assignedWaiters.push({
	// 			orderID: orderID,
	// 			waiterIds: waiterIds,
	// 		});
	// 	}
	// }

	//  ---------reviews------------------
	set reviews(orderReviews: orderReviews) {
		console.info('setting review to ', orderReviews);
		this._reviews = orderReviews;
	}

	get reviews(): orderReviews {
		return this._reviews;
	}

	addReview(orderID: string, details: string, rating: number): void {
		console.info('Updating reviews with ', orderID, details, rating);
		this._reviews.push({
			orderID: orderID,
			review: {details: details, rating: rating},
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
