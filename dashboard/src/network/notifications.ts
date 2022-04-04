import OrdersViewModel from '../viewModel/ordersViewModel';
import WaiterViewModel from '../viewModel/waitersViewModel';

export default class Notificiations {
	private ordersViewModel: OrdersViewModel;
	private waitersViewModel: WaiterViewModel;
	constructor(
		ordersViewModel: OrdersViewModel,
		waitersViewModel: WaiterViewModel
	) {
		this.ordersViewModel = ordersViewModel;
		this.waitersViewModel = waitersViewModel;
	}

	eventCallbacks = {
		updateOrders: this.updateOrders,
		updateWaiters: this.updateWaiters,
	};

	updateOrders(params: any) {
		if (params[0]) {
			this.ordersViewModel.orders = params[0];
		}
	}

	updateWaiters(params: any) {
		if (params[0]) {
			this.waitersViewModel.waiters = params[0];
		}
	}
}
