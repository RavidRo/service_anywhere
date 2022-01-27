import {getWaiters, assignWaiter, getWaitersByOrder} from '../network/api';

export default class WaiterDialogViewModel {
	getWaiters() {
		return getWaiters();
	}

	assignWaiter(orderId, waiter) {
		return assignWaiter(orderId, waiter);
	}

	getWaitersByOrder(orderId) {
		return getWaitersByOrder(orderId);
	}
}
