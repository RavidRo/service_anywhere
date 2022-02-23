import {getWaitersByOrder, assignWaiter} from '../network/api';

export default class WaiterDialogViewModel {
	constructor(waitersModel) {
		this.waitersModel = waitersModel;
	}

	get waiters() {
		return this.waitersModel.waiters;
	}

	set waiters(waiters) {
		this.waitersModel.waiters = waiters;
	}

	assignWaiter(orderId, waiter) {
		return assignWaiter(orderId, waiter);
	}

	getWaitersByOrder(orderId) {
		return getWaitersByOrder(orderId);
	}
}
