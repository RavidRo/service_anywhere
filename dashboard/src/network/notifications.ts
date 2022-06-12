/* eslint-disable max-len */
import OrdersViewModel from '../viewModel/ordersViewModel';
import WaiterViewModel from '../viewModel/waitersViewModel';
import {isOrder, isOrderStatus, orderStatusType, isReview} from '../typeGuard';

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
			const review = params as {
				orderID: string;
				details: string;
				rating: number;
			};
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

	// errorWaiter(params: object) {
	// 	if (isWaiterError(params)) {
	// 		console.info('receiving waiter review', params);
	// 		const error = params as {
	// 			errorMsg: string;
	// 			waiterId: string;
	// 		};
	// 		this.waitersViewModel.waiterError(
	// 			error.waiterId,
	// 			review.details,
	// 			review.rating
	// 		);
	// 	} else {
	// 		console.warn(
	// 			"Haven't received the correct arguments, the param should be a order review"
	// 		);
	// 	}
	// }

	// errorGuest(params: object) {
	// 	if (isReview(params)) {
	// 		console.info('adding review', params);
	// 		const review = params as {
	// 			orderID: string;
	// 			details: string;
	// 			rating: number;
	// 		};
	// 		this.ordersViewModel.addReview(
	// 			review.orderID,
	// 			review.details,
	// 			review.rating
	// 		);
	// 	} else {
	// 		console.warn(
	// 			"Haven't received the correct arguments, the param should be a order review"
	// 		);
	// 	}
	// }
	eventCallbacks: Record<string, (params: object) => void> = {
		newOrder: params => this.addNewOrder(params),
		changeOrderStatus: params => this.changeOrderStatus(params),
		review: params => this.addReview(params), // TODO: when notification is added in server, change name to match
		// errorGuest: params => this.errorGuest(params),
		// errorWaiter: params => this.errorWaiter(params),
		// updateWaiters: params => this.updateWaiters(params),
	};
}
// updateOrderStatus: params => this.updateOrderStatus(params),

// public notifyErrorGuest(
// 	receiverID: string,
// 	errorMsg: string,
// 	orderId: string
// ) {
// 	this.notifier.notify(receiverID, 'errorGuest', {
// 		errorMsg: errorMsg,
// 		orderId: orderId,
// 	});
// }

// public notifyErrorWaiter(
// 	receiverID: string,
// 	errorMsg: string,
// 	waiterId: string
// ) {
// 	this.notifier.notify(receiverID, 'errorWaiter', {
// 		errorMsg: errorMsg,
// 		waiterId: waiterId,
// 	});
// }
