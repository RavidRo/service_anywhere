import {OrderIDO, OrderStatus} from '../../api';

import {makeGood, ResponseMsg} from '../Response';

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

async function getWaiters(): Promise<ResponseMsg<WaiterDAO[]>> {
	return makeGood(await WaiterOrder.getAllWaiters());
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
	newStatus: OrderStatus,
	ID: string
): Promise<ResponseMsg<void>> {
	return WaiterOrder.changeOrderStatus(orderID, newStatus, ID);
}

export default {
	getAllOrders,
	assignWaiter,
	getWaiters,
	getWaiterByOrder,
	cancelOrderAdmin,
	changeOrderStatus,
};
