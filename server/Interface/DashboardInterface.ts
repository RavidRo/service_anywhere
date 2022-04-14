import {OrderStatus} from '../../api';

import {makeFail, makeGood, ResponseMsg} from '../Response';

import {IOrder} from '../Logic/IOrder';
import {WaiterOrder} from '../Logic/WaiterOrder';

const statusOk = 200;
const statusNotFound = 404;

function getOrders(): ResponseMsg<IOrder[]> {
	return makeGood(IOrder.orderList);
}

function assignWaiter(
	orderIds: string[],
	waiterID: string
): Promise<ResponseMsg<void>> {
	return WaiterOrder.getInstance().assignWaiter(orderIds, waiterID);
}

async function getWaiters(): Promise<ResponseMsg<string[]>> {
	return makeGood(
		(await WaiterOrder.getInstance().waiters).map(waiter => waiter.id)
	);
}

function getWaiterByOrder(orderID: string): ResponseMsg<string[]> {
	const orderExists = IOrder.orderList.some(
		order => order.getID() === orderID
	);
	if (!orderExists) {
		return makeFail('Requested error does not exist', statusNotFound);
	}
	const waiters = WaiterOrder.getInstance().orderToWaiters.get(orderID);
	return makeGood(waiters ?? []);
}

function cancelOrderAdmin(orderId: string): ResponseMsg<void> {
	let response = IOrder.delegate(orderId, order => {
		order.cancelOrder();
		return makeGood();
	});
	if (response.isSuccess()) {
		WaiterOrder.getInstance().makeAvailable(orderId);
	}
	return response;
}

function changeOrderStatus(
	orderId: string,
	newStatus: OrderStatus
): ResponseMsg<void> {
	const response = IOrder.delegate(orderId, order => {
		return order.changeOrderStatus(newStatus);
	});
	const assignableStatuses: OrderStatus[] = ['assigned', 'on the way'];
	if (response.isSuccess() && !assignableStatuses.includes(newStatus)) {
		WaiterOrder.getInstance().makeAvailable(orderId);
	}
	return response;
}

export default {
	getOrders,
	assignWaiter,
	getWaiters,
	getWaiterByOrder,
	cancelOrderAdmin,
	changeOrderStatus,
};
