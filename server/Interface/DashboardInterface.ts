import {IOrder} from 'server/Logic/IOrder';
import {OrderStatus} from '../../api';
import {WaiterOrder} from '../Logic/WaiterOrder';

function getOrders(): IOrder[] {
	return IOrder.orderList;
}

function assignWaiter(orderID: string, waiterID: string): void {
	WaiterOrder.assignWaiter(orderID, waiterID);
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
	orderId;
	throw new Error('Method not implemented');
}

function changeOrderStatus(orderId: string, newStatus: OrderStatus): void {
	orderId;
	newStatus;
	throw new Error('Method not implemented');
}

export default {
	getOrders,
	assignWaiter,
	getWaiters,
	getWaiterByOrder,
	cancelOrderAdmin,
	changeOrderStatus,
};
