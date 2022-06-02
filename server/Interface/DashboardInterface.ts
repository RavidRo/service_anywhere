import {OrderIDO, OrderStatus, WaiterIDO} from '../../api';

import {makeFail, makeGood, ResponseMsg} from '../Response';

import {onOrder, getOrders} from '../Logic/Orders';
import WaiterOrder from '../Logic/WaiterOrder';

import config from '../config.json';
import {WaiterDAO} from 'server/Data/entities/Domain/WaiterDAO';

async function getAllOrders(): Promise<ResponseMsg<OrderIDO[]>> {
	return makeGood((await getOrders()).map(order => order.getDetails()));
}

function assignWaiter(
	orderIds: string[],
	waiterID: string
): Promise<ResponseMsg<void>> {
	return WaiterOrder.assignWaiter(orderIds, waiterID);
}

async function getWaiters(): Promise<ResponseMsg<WaiterIDO[]>> {
	return makeGood(
		(await WaiterOrder.getAllWaiters()).map(waiter => waiter.getDetails())
	);
}

async function getWaiterByOrder(
	orderID: string
): Promise<ResponseMsg<string[]>> {
	return await WaiterOrder.getWaiterByOrder(orderID);
}

async function cancelOrderAdmin(
	orderID: string,
	ID: string
): Promise<ResponseMsg<void>> {
	return WaiterOrder.changeOrderStatus(orderID, 'canceled', ID);
}

async function changeOrderStatus(
	orderID: string,
	newStatus: string,
	ID: string
): Promise<ResponseMsg<void>> {
	const statuses = [
		'received',
		'in preparation',
		'ready to deliver',
		'assigned',
		'on the way',
		'delivered',
		'canceled',
	];

	if (!statuses.includes(newStatus)) {
		return makeFail('There is no such status', 400);
	}
	return WaiterOrder.changeOrderStatus(orderID, newStatus as OrderStatus, ID);
}

export default {
	getAllOrders,
	assignWaiter,
	getWaiters,
	getWaiterByOrder,
	cancelOrderAdmin,
	changeOrderStatus,
};
