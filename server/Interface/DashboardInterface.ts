import {IOrder} from 'server/Logic/IOrder';
import {makeGood, ResponseMsg} from 'server/Response';
import {OrderStatus} from '../../api';
import {WaiterOrder} from '../Logic/WaiterOrder';
import { responseStatus } from './ResponseStatus';

const statusOk = 200
const statusNotFound = 404

function getOrders(): responseStatus {
	return {response: IOrder.orderList, status: statusOk};
}

function assignWaiter(orderIds: string[], waiterID: string): responseStatus {	//todo: return type should include status code
	let response = WaiterOrder.assignWaiter(orderIds, waiterID);
	if(response.isSuccess()){
		return {response: 'assigned successfully', status: response.getStatusCode()}
	}
	return {response: response.getError(), status: response.getStatusCode()}
}

function getWaiters(): responseStatus {
	return {response: WaiterOrder.waiterList.map(waiter => waiter.id), status: statusOk};
}

function getWaiterByOrder(orderID: string): responseStatus {
	let waiters = WaiterOrder.orderToWaiters.get(orderID);
	if (waiters) {
		return {response: waiters, status: statusOk};
	}
	return {response: 'No such order or no waiters assigned.', status: statusNotFound};
}

function cancelOrderAdmin(orderId: string): responseStatus {
	let response = IOrder.delegate(orderId, order => {
		order.cancelOrder();
		return makeGood();
	});
	if(response.isSuccess()){
		WaiterOrder.makeAvailable(orderId);
		return {response: 'order was canceled', status: response.getStatusCode()}
	}
	return {response: response.getError(), status: response.getStatusCode()}
}

function changeOrderStatus(orderId: string, newStatus: OrderStatus): responseStatus {	//todo: pass through WaiterOrder so we can unassign waiters if needed
	let res = IOrder.delegate(orderId, order => {
		order.changeOrderStatus(newStatus);
		return makeGood();
	});
	if(res.isSuccess()){
		return {response: 'status was changed successfully', status: statusOk}
	}
	return {response: res.getError(), status: res.getStatusCode()}
}

export default {
	getOrders,
	assignWaiter,
	getWaiters,
	getWaiterByOrder,
	cancelOrderAdmin,
	changeOrderStatus,
};
