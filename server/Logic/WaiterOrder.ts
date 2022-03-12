import {v4 as uuidv4} from 'uuid';
import {makeFail, makeGood, ResponseMsg} from '../Response';

export class WaiterOrder {
	static waiterList: string[] = ['imashelTommer', 'abashelTommer']; //todo: remove those
	static waiterToOrders: Map<string, string[]> = new Map();
	static orderToWaiters: Map<string, string[]> = new Map();

	static connectWaiter(): string {
		let waiterId = uuidv4();
		this.waiterList.push(waiterId);
		return waiterId;
	}

	static assignWaiter(orderId: string, waiterId: string): void {
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
