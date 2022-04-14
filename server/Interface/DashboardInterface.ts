import {IOrder} from 'server/Logic/IOrder';
import {makeFail, makeGood, ResponseMsg} from 'server/Response';
import {OrderStatus} from '../../api';
import {WaiterOrder} from '../Logic/WaiterOrder';

const statusOk = 200
const statusNotFound = 404

function getOrders(): ResponseMsg<IOrder[]> {
	return makeGood(IOrder.orderList)
}

function assignWaiter(orderIds: string[], waiterID: string): ResponseMsg<void> {
	return WaiterOrder.assignWaiter(orderIds, waiterID);
}

function getWaiters(): ResponseMsg<string[]> {
	return makeGood(WaiterOrder.waiterList.map(waiter => waiter.id))
}

function getWaiterByOrder(orderID: string): ResponseMsg<string[]> {
	let waiters = WaiterOrder.orderToWaiters.get(orderID);
	if (waiters) {
		return makeGood(waiters)
	}
	return makeFail('No such order or no waiters assigned.', statusNotFound);
}

function cancelOrderAdmin(orderId: string): ResponseMsg<void> {
	let response = IOrder.delegate(orderId, order => {
		order.cancelOrder();
		return makeGood();
	});
	if(response.isSuccess()){
		WaiterOrder.makeAvailable(orderId)
	}
	return response
}

function changeOrderStatus(orderId: string, newStatus: OrderStatus): ResponseMsg<void> {
	let response = IOrder.delegate(orderId, order => {
		order.changeOrderStatus(newStatus);
		return makeGood();
	});
	const assignableStatuses: OrderStatus[] = ['assigned', 'on the way']
	if(response.isSuccess() && !(newStatus in assignableStatuses)){
		WaiterOrder.makeAvailable(orderId)
	}
	return response
}

export default {
	getOrders,
	assignWaiter,
	getWaiters,
	getWaiterByOrder,
	cancelOrderAdmin,
	changeOrderStatus,
};
