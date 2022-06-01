/* eslint-disable max-len */
import OrdersViewModel from '../viewModel/ordersViewModel';
import WaiterViewModel from '../viewModel/waitersViewModel';
import {isOrder, isOrderStatus, orderStatusType, isReview} from '../typeGuard';
import {ReviewIDO} from '../../../api';

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

	addNewOrder(params: object) {
		if (isOrder(params)) {
			console.log('Updating new orders', params);
			this.ordersViewModel.updateOrder(params.order);
		} else {
			console.warn(
				"Haven't received the correct arguments, the argument should be an order"
			);
		}
	}

	changeOrderStatus(params: object) {
		if (isOrderStatus(params)) {
			console.info('Changing order status', params);
			const orderStatus = params as orderStatusType;
			this.ordersViewModel.changeOrderStatusNotification(
				orderStatus.orderID,
				orderStatus.orderStatus
			);
		} else {
			console.warn(
				"Haven't received the correct arguments, the param should be a order status"
			);
		}
	}

	addReview(params: object) {
		if (isReview(params)) {
			console.info('adding review', params);
			const review = params as {orderId: string; review: ReviewIDO};
			this.ordersViewModel.addReview(review.orderId, review.review);
		} else {
			console.warn(
				"Haven't received the correct arguments, the param should be a order review"
			);
		}
	}

	eventCallbacks: Record<string, (params: object) => void> = {
		newOrder: params => this.addNewOrder(params),
		changeOrderStatus: params => this.changeOrderStatus(params),
		addReview: params => this.addReview(params), // TODO: when notification is added in server, change name to match
		// updateWaiters: params => this.updateWaiters(params),
	};
}
// updateOrderStatus: params => this.updateOrderStatus(params),
