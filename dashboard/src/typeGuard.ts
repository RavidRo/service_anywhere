import {WaiterIDO, OrderIDO, OrderStatus} from '../../api';

export function isWaiterArray(waiter: object): waiter is WaiterIDO {
	console.log('Received ' + waiter);
	if (!waiter) {
		return false;
	}
	return (
		isString((waiter as WaiterIDO).id) &&
		isString((waiter as WaiterIDO).username)
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
		isString((order as OrderIDO).guestID) &&
		isString((order as OrderIDO).id) &&
		(order as OrderIDO).items !== undefined &&
		isStatus((order as OrderIDO).status)
	);
}

type orderReview = {orderID: string; details: string; rating: number};
export function isReview(review: object): review is orderReview {
	console.log('is Review: ', review);
	if (!review) {
		return false;
	}
	return (
		isString((review as orderReview).orderID) &&
		isString((review as orderReview).details) &&
		isNumber((review as orderReview).rating)
	);
}

export type orderStatusType = {orderID: string; orderStatus: OrderStatus};
export function isOrderStatus(status: object): status is orderStatusType {
	console.log('is Status: ', status);
	if (!status) {
		return false;
	}
	return (
		isString((status as orderStatusType).orderID) &&
		isString((status as orderStatusType).orderStatus)
	);
}

export function isStatus(status: unknown): status is OrderStatus {
	const result = ['unassigned', 'inprogress', 'completed', 'delivered'].find(
		availableStatus => availableStatus === status
	);
	return result !== undefined;
}

export function isString(someString: unknown): someString is string {
	return typeof someString === 'string';
}

export function isNumber(someNumber: unknown): someNumber is number {
	return typeof someNumber === 'number';
}
