import {WaiterIDO, OrderIDO} from '../../api';

export function isWaiterArray(waiters: any[]): waiters is WaiterIDO[] {
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

export function isOrderArray(orders: any[]): orders is OrderIDO[] {
	if (!orders || !Array.isArray(orders)) {
		return false;
	}
	if (orders.length === 0) {
		return true;
	}
	const ret = orders.reduce((prev, order) => {
		return (
			(order as OrderIDO).creationTime !== undefined &&
			(order as OrderIDO).guestId !== undefined &&
			(order as OrderIDO).id !== undefined &&
			(order as OrderIDO).items !== undefined &&
			(order as OrderIDO).status !== undefined &&
			(order as OrderIDO).terminationTime !== undefined &&
			prev
		);
	});

	return ret;
}
