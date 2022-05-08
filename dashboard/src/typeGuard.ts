import {WaiterIDO, OrderIDO, OrderStatus} from '../../api';

export function isWaiterArray(waiter: object): waiter is WaiterIDO {
	console.log('Received ' + waiter);
	if (!waiter) {
		return false;
	}
	return (
		(waiter as WaiterIDO).avialabe !== undefined &&
		(waiter as WaiterIDO).id !== undefined &&
		(waiter as WaiterIDO).name !== undefined
	);
}

export function isOrder(order: object): order is OrderIDO {
	console.log('is Order Array: ', order);
	if (!order) {
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
	if (!status) {
		return false;
	}
	return (
		(status as orderStatusType).orderID !== undefined &&
		(status as orderStatusType).orderStatus !== undefined
	);
}
