/* eslint-disable max-len */
import OrdersViewModel from '../viewModel/ordersViewModel';
import WaiterViewModel from '../viewModel/waitersViewModel';
import {
	isOrder,
	isOrderStatus,
	orderStatusType,
	isReview,
	isGuestError,
	isWaiterError,
} from '../typeGuard';

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
			this.ordersViewModel.addOrder(params.order);
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
			const review = params;
			this.ordersViewModel.addReview(
				review.orderID,
				review.details,
				review.rating
			);
		} else {
			console.warn(
				"Haven't received the correct arguments, the param should be a order review"
			);
		}
	}

	errorWaiter(params: object) {
		if (isWaiterError(params)) {
			console.info('receiving waiter review', params);
			const error = params as {
				errorMsg: string;
				waiterID: string;
			};
			this.waitersViewModel.waiterError(error.waiterID, error.errorMsg);
		} else {
			console.warn(
				"Haven't received the correct arguments, the param should be a waiter error"
			);
		}
	}

	errorGuest(params: object) {
		if (isGuestError(params)) {
			console.info('receiving waiter review', params);
			const error = params as {
				errorMsg: string;
				orderID: string;
			};
			this.ordersViewModel.addGuestError(error.orderID, error.errorMsg);
		} else {
			console.warn(
				"Haven't received the correct arguments, the param should be a guest error"
			);
		}
	}
	eventCallbacks: Record<string, (params: object) => void> = {
		newOrder: params => this.addNewOrder(params),
		changeOrderStatus: params => this.changeOrderStatus(params),
		review: params => this.addReview(params),
		errorGuest: params => this.errorGuest(params),
		errorWaiter: params => this.errorWaiter(params),
	};
}
