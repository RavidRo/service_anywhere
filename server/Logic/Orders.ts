import {isPromise} from 'util/types';

import {OrderIDO} from 'api';
import {makeFail, makeGood, ResponseMsg} from '../Response';

import * as OrderStore from '../Data/Stores/OrderStore';

import {OrderNotifier} from './OrderNotifier';
import {IOrder} from './IOrder';

export async function onOrder<T>(
	orderID: string,
	func: (order: IOrder) => ResponseMsg<T> | Promise<ResponseMsg<T>>
): Promise<ResponseMsg<T>> {
	const orderResponse = await getOrder(orderID);
	if (orderResponse.isSuccess()) {
		const order = orderResponse.getData();
		const result = func(order);
		if (isPromise(result)) {
			return await result;
		}
		return result;
	}
	return makeFail(orderResponse.getError(), orderResponse.getStatusCode());
}

export async function getGuestActiveOrder(
	guestID: string
): Promise<ResponseMsg<OrderIDO>> {
	const orders = await getOrders();
	const activeOrdersOfGuest = orders.filter(
		order => order.getGuestId() === guestID && order.isActive()
	);

	if (activeOrdersOfGuest.length === 0) {
		return makeFail('Requested guest does not have any active orders', 404);
	}
	const currentOrder = activeOrdersOfGuest[0].getDetails();
	return makeGood(currentOrder);
}

export async function getOrder(orderID: string): Promise<ResponseMsg<IOrder>> {
	const orderDAO = await OrderStore.getOrder(orderID);
	if (!orderDAO) {
		return makeFail('Could not find requested order');
	}
	return makeGood(OrderNotifier.createOrder(orderDAO));
}

/**
 *
 * @param ordersIDs An optional parameter of the requested orders' ids
 * @returns An array of all the orders or a subset of the requested orders.
 * If could not find an order of a requested id than the returned array does not contain an order that corresponds to the requested id.
 */
export async function getOrders(ordersIDs?: string[]): Promise<IOrder[]> {
	const ordersDAOs = await OrderStore.getOrders();
	const orders = ordersDAOs.map(OrderNotifier.createOrder);

	if (ordersIDs === undefined) {
		return orders;
	}
	return orders.filter(order => ordersIDs.includes(order.getID()));
}
