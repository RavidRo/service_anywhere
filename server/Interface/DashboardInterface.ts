import {IOrder} from 'server/Logic/IOrder';
import {makeGood, ResponseMsg} from 'server/Response';
import {OrderStatus} from '../../api';
import {WaiterOrder} from '../Logic/WaiterOrder';

function getOrders(): IOrder[] {
	return IOrder.orderList;
}

function assignWaiter(orderIds: string[], waiterID: string): string {	//todo: return type should include status code
	let response = WaiterOrder.assignWaiter(orderIds, waiterID);
	if(response.isSuccess()){
		return 'assigned successfully'
	}
	return response.getError()
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
	let response = IOrder.delegate(orderId, order => {
		order.cancelOrder();
		return makeGood();
	});
	if(response.isSuccess()){
		WaiterOrder.makeAvailable(orderId);
	}
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
