import {WaiterIDO, OrderIDO, OrderStatus} from '../../api';

export function isWaiterArray(waiters: any[]): waiters is WaiterIDO[] {
	console.log('Received ' + waiters);
	if (!waiters || !Array.isArray(waiters)) {
		return false;
	}
	if (waiters.length === 0) {
		return true;
	}
	const ret = waiters.reduce((prev, waiter) => {
		return (
			(waiter as WaiterIDO).avialabe !== undefined &&
			(waiter as WaiterIDO).id !== undefined &&
			(waiter as WaiterIDO).name !== undefined &&
			prev
		);
	});
	return ret;
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

export type orderStatus = {orderID: string; orderStatus: OrderStatus};
export function isOrderStatus(status: object): status is orderStatus {
	if (!status) {
		return false;
	}
	return (
		(status as orderStatus).orderID !== undefined &&
		(status as orderStatus).orderStatus !== undefined
	);
}
