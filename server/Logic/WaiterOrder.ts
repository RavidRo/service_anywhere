import {Location} from 'api';
import {v4 as uuidv4} from 'uuid';
import {makeFail, makeGood, ResponseMsg} from '../Response';
import {IOrder} from './IOrder';
import {OrderNotifier} from './OrderNotifier';
import {Waiter} from './Waiter';

export class WaiterOrder {
	static waiterList: Waiter[] = [];
	static waiterToOrders: Map<string, string[]> = new Map();
	static orderToWaiters: Map<string, string[]> = new Map();
	
	static makeAvailable(orderId: string) {
		let waiters = this.orderToWaiters.get(orderId)
		waiters?.forEach((waiterId) =>{
				this.waiterList.filter((waiter) => waiter.id === waiterId).forEach((w) => w.available = true)
			}
		)
	}

	static updateWaiterLocation(
		waiterId: string,
		mapId: string,
		location: Location
	) {
		let waiterOrders = this.waiterToOrders.get(waiterId);
		if (waiterOrders) {
			waiterOrders.forEach(order => {
				IOrder.delegate(order, o =>
					o.updateWaiterLocation(mapId, location)
				);
			});
		}
	}

	static getGuestOrder(guestId: string): import('api').OrderIDO {
		return IOrder.orderList
			.filter(
				value =>
					value.getGuestId() === guestId &&
					value.getDetails().terminationTime === undefined
			)[0]
			.getDetails();
	}

	static connectWaiter(): string {
		let waiter = new Waiter();
		this.waiterList.push(waiter);
		return waiter.id;
	}

	static assignWaiter(orderId: string, waiterId: string): ResponseMsg<void> {
		let orders = this.waiterToOrders.get(waiterId);
		if (orders) {
			orders.push(orderId);
		} else {
			this.waiterToOrders.set(waiterId, [orderId]);
		}
		let waiter = this.waiterList.find((value) => value.id === waiterId)
		if(!waiter?.available){
			return makeFail('waiter unavailable')
		}
		let waiters = this.orderToWaiters.get(orderId);
		if (waiters) {
			waiters.push(waiterId);
		} else {
			this.orderToWaiters.set(orderId, [waiterId]);
		}
		waiter.available = false
		return makeGood()
	}

	static getWaiterByOrder(orderId: string): ResponseMsg<string[]> {
		let waiters = this.orderToWaiters.get(orderId);
		if (waiters) {
			return makeGood(waiters);
		}
		return makeGood([]);
	}

	static getWaiterOrder(waiterId: string): ResponseMsg<string[]> {
		let orders = this.waiterToOrders.get(waiterId);
		if (orders) {
			return makeGood(orders);
		}
		return makeGood([]);
	}

	static createOrder(guestId: string, items: Map<string, number>): string {
		let newOrder = OrderNotifier.createOrder(guestId, items);
		IOrder.orderList.push(newOrder);
		return newOrder.getId();
	}
}
