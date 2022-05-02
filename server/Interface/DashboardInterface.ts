import {OrderIDO, OrderStatus} from '../../api';

import {makeGood, ResponseMsg} from '../Response';

import {onOrder, getOrders} from '../Logic/Orders';
import WaiterOrder from '../Logic/WaiterOrder';

import config from '../config.json';

async function getAllOrders(): Promise<ResponseMsg<OrderIDO[]>> {
	return makeGood((await getOrders()).map(order => order.getDetails()));
}

function assignWaiter(
	orderIds: string[],
	waiterID: string
): Promise<ResponseMsg<void>> {
	return WaiterOrder.assignWaiter(orderIds, waiterID);
}

async function getWaiters(): Promise<ResponseMsg<string[]>> {
	return makeGood(
		(await WaiterOrder.getAllWaiters()).map(waiter => waiter.id)
	);
}

async function getWaiterByOrder(
	orderID: string
): Promise<ResponseMsg<string[]>> {
	return await WaiterOrder.getWaiterByOrder(orderID);
}

async function cancelOrderAdmin(orderID: string): Promise<ResponseMsg<void>> {
	return WaiterOrder.changeOrderStatus(orderID, 'canceled', config.admin_id);
}

async function changeOrderStatus(
	orderID: string,
	newStatus: OrderStatus
): Promise<ResponseMsg<void>> {
	return WaiterOrder.changeOrderStatus(orderID, newStatus, config.admin_id);
}

export default {
	getAllOrders,
	assignWaiter,
	getWaiters,
	getWaiterByOrder,
	cancelOrderAdmin,
	changeOrderStatus,
};
