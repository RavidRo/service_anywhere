import {v4 as uuidv4} from 'uuid';
import {OrderID, WaiterID} from '../api';
import {makeFail, makeGood, ResponseMsg} from '../Response';

export class WaiterOrder {
	static waiterList: string[] = [];
	static waiterToOrders: Map<string, string[]> = new Map();
	static orderToWaiters: Map<string, string[]> = new Map();

	static connectWaiter(): string {
		let waiterId = uuidv4();
		this.waiterList.push(waiterId);
		return waiterId;
	}

	static assignWaiter(orderId: OrderID, waiterId: WaiterID): void {
		let orders = this.waiterToOrders.get(waiterId);
		if (orders) {
			orders.push(orderId);
		} else {
			this.waiterToOrders.set(waiterId, [orderId]);
		}
		let waiters = this.orderToWaiters.get(orderId);
		if (waiters) {
			waiters.push(waiterId);
		} else {
			this.orderToWaiters.set(orderId, [waiterId]);
		}
	}

	static getWaiterByOrder(orderId: OrderID): ResponseMsg<string[]> {
		let waiters = this.orderToWaiters.get(orderId);
		if (waiters) {
			return makeGood(waiters);
		}
		return makeGood([]);
	}

	static getWaiterOrder(waiterId: WaiterID): ResponseMsg<string[]> {
		let orders = this.waiterToOrders.get(waiterId);
		if (orders) {
			return makeGood(orders);
		}
		return makeGood([]);
	}

	static updateWaiterLocation(
		waiterId: string,
		mapId: string,
		location: Location
	): string {
		waiterId;
		mapId;
		location;
		return '';
		//todo: this
	}
}
