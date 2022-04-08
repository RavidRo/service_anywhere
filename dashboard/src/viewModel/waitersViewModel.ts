import {getWaitersByOrder, assignWaiter} from '../network/api';
import WaiterModel from '../model/waiterModel';

export default class WaiterViewModel {
	private waitersModel: WaiterModel;

	constructor(waitersModel: WaiterModel) {
		this.waitersModel = waitersModel;
	}

	get waiters() {
		return this.waitersModel.waiters;
	}

	set waiters(waiters) {
		this.waitersModel.waiters = waiters;
	}

	assignWaiter(orderId: string, waiter: string) {
		return assignWaiter(orderId, waiter);
	}

	getWaitersByOrder(orderId: string) {
		return getWaitersByOrder(orderId);
	}
}
