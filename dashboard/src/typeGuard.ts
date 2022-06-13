import {WaiterIDO, OrderIDO, OrderStatus, ReviewIDO} from '../../api';

export function isWaiterArray(waiter: object): waiter is WaiterIDO {
	console.log('Received ' + waiter);
	if (!waiter) {
		return false;
	}
	return (
		(waiter as WaiterIDO).id !== undefined &&
		(waiter as WaiterIDO).username !== undefined
	);
}

export function isOrder(params: object): params is {order: OrderIDO} {
	console.log('is Order: ', params);
	if (!params) {
		return false;
	}
	const order = (params as {order: OrderIDO}).order;
	if (order === undefined) {
		return false;
	}
	return (
		(order as OrderIDO).creationTime !== undefined &&
		(order as OrderIDO).guestID !== undefined &&
		(order as OrderIDO).id !== undefined &&
		(order as OrderIDO).items !== undefined &&
		(order as OrderIDO).status !== undefined
	);
}

type orderReview = {orderID: string; details: string; rating: number};
export function isReview(review: object): review is orderReview {
	console.log('is Review: ', review);
	if (!review) {
		return false;
	}
	return (
		(review as orderReview).orderID !== undefined &&
		(review as orderReview).details !== undefined &&
		(review as orderReview).rating !== undefined
	);
}

export type orderStatusType = {orderID: string; orderStatus: OrderStatus};
export function isOrderStatus(status: object): status is orderStatusType {
	console.log('is Status: ', status);
	if (!status) {
		return false;
	}
	return (
		(status as orderStatusType).orderID !== undefined &&
		(status as orderStatusType).orderStatus !== undefined
	);
}

type waiterError = {errorMsg: string; waiterID: string};
export function isWaiterError(error: object): error is waiterError {
	console.log('is waiter error: ', error);
	if (!error) {
		return false;
	}
	return (
		(error as waiterError).waiterID !== undefined &&
		(error as waiterError).errorMsg !== undefined
	);
}

type guestError = {errorMsg: string; orderID: string};
export function isGuestError(error: object): error is guestError {
	console.log('is guest error: ', error);
	if (!error) {
		return false;
	}
	return (
		(error as guestError).orderID !== undefined &&
		(error as guestError).errorMsg !== undefined
	);
}

export function isString(someString: unknown): someString is string {
	return typeof someString === 'string';
}
