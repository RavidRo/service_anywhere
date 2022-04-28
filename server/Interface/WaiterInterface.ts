import {Location, OrderIDO} from '../../api';

import {ResponseMsg} from '../Response';

import WaiterOrder from '../Logic/WaiterOrder';

async function getOrdersByWaiter(
	waiterID: string
): Promise<ResponseMsg<OrderIDO[]>> {
	return await WaiterOrder.getOrdersByWaiter(waiterID);
}

async function orderArrived(orderId: string, _waiterID: string): Promise<ResponseMsg<void>> {
	return WaiterOrder.changeOrderStatus(orderId, 'delivered');
}

function updateLocationWaiter(
	waiterId: string,
	mapId: string,
	location: Location
): void {
	WaiterOrder.updateWaiterLocation(waiterId, mapId, location);
}

async function orderOnTheWay(orderId: string, _waiterID: string): Promise<ResponseMsg<void>> {
	return WaiterOrder.changeOrderStatus(orderId, 'on the way');
}

export default {
	getWaiterOrders: getOrdersByWaiter,
	orderArrived,
	updateLocationWaiter,
	orderOnTheWay,
};
