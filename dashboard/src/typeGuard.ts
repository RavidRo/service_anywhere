import {WaiterIDO, OrderIDO, OrderStatus} from '../../api';

export function isWaiterArray(waiter: object): waiter is WaiterIDO {
	console.log('Received ' + waiter);
	if (!waiter) {
		return false;
	}
	return (
		(waiter as WaiterIDO).available !== undefined &&
		(waiter as WaiterIDO).id !== undefined &&
		(waiter as WaiterIDO).name !== undefined
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
		(order as OrderIDO).guestId !== undefined &&
		(order as OrderIDO).id !== undefined &&
		(order as OrderIDO).items !== undefined &&
		(order as OrderIDO).status !== undefined
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

export function isString(someString: any): someString is string {
	return typeof someString === 'string';
}
