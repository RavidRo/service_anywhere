import {GuestIDO, Location, OrderIDO} from '../../api';

import {ResponseMsg} from '../Response';

import WaiterOrder from '../Logic/WaiterOrder';

import {getGuestsDetails as getDetails} from '../Data/Stores/GuestStore';

async function getOrdersByWaiter(
	waiterID: string
): Promise<ResponseMsg<OrderIDO[]>> {
	return await WaiterOrder.getOrdersByWaiter(waiterID);
}

async function orderArrived(
	orderId: string,
	waiterID: string
): Promise<ResponseMsg<void>> {
	return WaiterOrder.changeOrderStatus(orderId, 'delivered', waiterID);
}

function updateLocationWaiter(waiterId: string, location: Location): void {
	WaiterOrder.updateWaiterLocation(waiterId, location);
}

async function orderOnTheWay(
	orderId: string,
	waiterID: string
): Promise<ResponseMsg<void>> {
	return WaiterOrder.changeOrderStatus(orderId, 'on the way', waiterID);
}

function getWaiterName(waiterID: string): Promise<ResponseMsg<string>> {
	return WaiterOrder.getWaiterName(waiterID);
}

function getGuestsDetails(ids: string[]): Promise<GuestIDO[]> {
	return getDetails(ids);
}

export default {
	getWaiterOrders: getOrdersByWaiter,
	orderArrived,
	updateLocationWaiter,
	orderOnTheWay,
	getWaiterName,
	getGuestsDetails,
};
