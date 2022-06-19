import {OrderIDO, OrderStatus, ReviewIDO, STATUSES, WaiterIDO} from '../../api';
import {getReviews as getAllReviews} from '../Data/Stores/OrderStore';
import {getOrders} from '../Logic/Orders';
import WaiterOrder from '../Logic/WaiterOrder';
import {makeFail, makeGood, ResponseMsg} from '../Response';

const userErrorStatus = 400;

async function getAllOrders(): Promise<ResponseMsg<OrderIDO[]>> {
	return makeGood((await getOrders()).map(order => order.getDetails()));
}

function assignWaiter(
	orderID: string,
	waiterIDs: string[]
): Promise<ResponseMsg<void>> {
	return WaiterOrder.assignWaiter(orderID, waiterIDs);
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

function isStatus(s: string): s is OrderStatus {
	return STATUSES.includes(s as OrderStatus);
}

async function changeOrderStatus(
	orderID: string,
	newStatus: string,
	ID: string
): Promise<ResponseMsg<void>> {
	if (!isStatus(newStatus)) {
		return makeFail('There is no such status', userErrorStatus);
	}
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
