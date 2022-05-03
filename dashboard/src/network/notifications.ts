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
		console.log('Updating new orders', params);
		if (isOrderArray(params[0])) {
			this.ordersViewModel.updateOrder(params[0]);
		} else {
			console.warn(
				"Haven't received the correct arguments, the first argument should contain orders"
			);
		}
	}

	updateWaiters(params: any[]) {
		if (isWaiterArray(params[0])) {
			this.waitersViewModel.setWaiters(params[0]);
		} else {
			console.warn(
				"Haven't received the correct arguments, the first argument should contain the waiters"
			);
		}
	}

	eventCallbacks: Record<string, (params: unknown[]) => void> = {
		newOrder: params => this.updateOrders(params),
		updateWaiters: params => this.updateWaiters(params),
	};
}
// updateOrderStatus: params => this.updateOrderStatus(params),
