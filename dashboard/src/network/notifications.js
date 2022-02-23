export default class Notificiations {
	constructor(ordersViewModel, waitersViewModel) {
		this.ordersViewModel = ordersViewModel;
		this.waitersViewModel = waitersViewModel;
	}

	eventCallbacks = {
		updateOrders: this.updateOrders,
		updateWaiters: this.updateWaiters,
	};

	updateOrders(params) {
		if (params[0]) {
			this.ordersViewModel.orders = params[0];
		}
	}

	updateWaiters(params) {
		if (params[0]) {
			this.waitersViewModel.waiters = params[0];
		}
	}
}
