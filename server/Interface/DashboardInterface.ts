import {IOrder} from 'server/Logic/IOrder';
import {makeGood, ResponseMsg} from 'server/Response';
import {OrderStatus} from '../../api';
import {WaiterOrder} from '../Logic/WaiterOrder';

function getOrders(): IOrder[] {
	return IOrder.orderList;
}

function assignWaiter(orderIds: string[], waiterID: string): ResponseMsg<void> {
	return WaiterOrder.assignWaiter(orderIds, waiterID);
}

function getWaiters(): string[] {
	return WaiterOrder.waiterList.map(waiter => waiter.id);
}

function getWaiterByOrder(orderID: string): string[] {
	let waiters = WaiterOrder.orderToWaiters.get(orderID);
	if (waiters) {
		return waiters;
	}
	return [];
}

function cancelOrderAdmin(orderId: string): void {
	IOrder.delegate(orderId, order => {
		order.cancelOrder();
		return makeGood();
	});
	WaiterOrder.makeAvailable(orderId);	//todo: if succeeded
}

function changeOrderStatus(orderId: string, newStatus: OrderStatus): void {	//todo: pass through WaiterOrder so we can unassign waiters if needed
	IOrder.delegate(orderId, order => {
		order.changeOrderStatus(newStatus);
		return makeGood();
	});
}

export default {
	getOrders,
	assignWaiter,
	getWaiters,
	getWaiterByOrder,
	cancelOrderAdmin,
	changeOrderStatus,
};
