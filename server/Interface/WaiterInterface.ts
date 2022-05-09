import {Location, OrderIDO} from '../../api';

import {ResponseMsg} from '../Response';

import WaiterOrder from '../Logic/WaiterOrder';

async function getOrdersByWaiter(
	waiterID: string
): Promise<ResponseMsg<OrderIDO[]>> {
	return await WaiterOrder.getOrdersByWaiter(waiterID);
}

async function orderArrived(orderId: string, waiterID: string): Promise<ResponseMsg<void>> {
	return WaiterOrder.changeOrderStatus(orderId, 'delivered', waiterID);
}

function updateLocationWaiter(
	waiterId: string,
	mapId: string,
	location: Location
): void {
	WaiterOrder.updateWaiterLocation(waiterId, mapId, location);
}

async function orderOnTheWay(orderId: string, waiterID: string): Promise<ResponseMsg<void>> {
	return WaiterOrder.changeOrderStatus(orderId, 'on the way', waiterID);
}

function getWaiterName(waiterID: string): Promise<ResponseMsg<string>>{
	return WaiterOrder.getWaiterName(waiterID)
}

export default {
	getWaiterOrders: getOrdersByWaiter,
	orderArrived,
	updateLocationWaiter,
	orderOnTheWay,
	getWaiterName,
};
