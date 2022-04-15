import {Location} from '../../api';

import {makeGood, ResponseMsg} from '../Response';

import {IOrder} from '../Logic/IOrder';
import {WaiterOrder} from '../Logic/WaiterOrder';

async function getWaiterOrders(
	waiterID: string
): Promise<ResponseMsg<IOrder[]>> {
	const waiterOrder = WaiterOrder.getInstance();
	const ordersResponse = await waiterOrder.getOrdersByWaiter(waiterID);
	return ordersResponse.ifGood((data: string[]) => {
		return IOrder.orderList.filter(order => data.includes(order.getID()));
	});
}

function orderArrived(orderId: string): ResponseMsg<void> {
	const response = IOrder.delegate(orderId, (order: IOrder) => {
		return order.orderArrived();
	});
	return response.ifGood(() => {
		WaiterOrder.getInstance().makeAvailable(orderId);
	});
}

// function connectWaiter(): ResponseMsg<string> {
// 	return WaiterOrder.getInstance().connectWaiter();
// }

function updateLocationWaiter(
	waiterId: string,
	mapId: string,
	location: Location
): void {
	WaiterOrder.getInstance().updateWaiterLocation(waiterId, mapId, location);
}

function orderOnTheWay(orderId: string): ResponseMsg<void> {
	return IOrder.delegate(orderId, order => {
		return order.changeOrderStatus('on the way');
	});
}

export default {
	getWaiterOrders,
	orderArrived,
	// connectWaiter,
	updateLocationWaiter,
	orderOnTheWay,
};
