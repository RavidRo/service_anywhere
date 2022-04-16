import {OrderIDO, OrderStatus} from '../../api';

import {makeGood, ResponseMsg} from '../Response';

import {onOrder, IOrder, getOrders} from '../Logic/IOrder';
import WaiterOrder from '../Logic/WaiterOrder';

const statusOk = 200;
const statusNotFound = 404;

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

async function cancelOrderAdmin(orderId: string): Promise<ResponseMsg<void>> {
	const response = await onOrder(orderId, order => {
		order.cancelOrder();
		return makeGood();
	});
	if (response.isSuccess()) {
		WaiterOrder.makeAvailable(orderId);
	}
	return response;
}

async function changeOrderStatus(
	orderID: string,
	newStatus: OrderStatus
): Promise<ResponseMsg<void>> {
	const response = await onOrder(orderID, order => {
		return order.changeOrderStatus(newStatus);
	});
	const assignableStatuses: OrderStatus[] = ['assigned', 'on the way'];
	if (response.isSuccess() && !assignableStatuses.includes(newStatus)) {
		WaiterOrder.makeAvailable(orderID);
	}
	return response;
}

export default {
	getAllOrders,
	assignWaiter,
	getWaiters,
	getWaiterByOrder,
	cancelOrderAdmin,
	changeOrderStatus,
};
