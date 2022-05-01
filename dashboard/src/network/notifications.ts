import OrdersViewModel from '../viewModel/ordersViewModel';
import WaiterViewModel from '../viewModel/waitersViewModel';
import {isOrderArray, isWaiterArray} from '../typeGuard';

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

	updateOrders(params: any[]) {
		if (isOrderArray(params[0])) {
			this.ordersViewModel.setOrders(params[0]);
		} else {
			console.warn(
				"Haven't received the correct arguments, the first argument should contain orders"
			);
		}
	}

	updateWaiters(params: any[]) {
		if (isWaiterArray(params[0])) {
			this.waitersViewModel.waiters = params[0];
		} else {
			console.warn(
				"Haven't received the correct arguments, the first argument should contain the waiters"
			);
		}
	}

	eventCallbacks: Record<string, (params: unknown[]) => void> = {
		updateOrders: params => this.updateOrders(params),
		updateWaiters: params => this.updateWaiters(params),
	};
}
// updateOrderStatus: params => this.updateOrderStatus(params),
