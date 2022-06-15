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
	orderID: string,
	waiterID: string
): Promise<ResponseMsg<void>> {
	return WaiterOrder.changeOrderStatus(orderID, 'delivered', waiterID);
}

function updateLocationWaiter(waiterID: string, location: Location): void {
	WaiterOrder.updateWaiterLocation(waiterID, location);
}

async function orderOnTheWay(
	orderID: string,
	waiterID: string
): Promise<ResponseMsg<void>> {
	return WaiterOrder.changeOrderStatus(orderID, 'on the way', waiterID);
}

function getWaiterName(waiterID: string): Promise<ResponseMsg<string>> {
	return WaiterOrder.getWaiterName(waiterID);
}

function getGuestsDetails(ids: string[]): Promise<GuestIDO[]> {
	return getDetails(ids);
}

function locationErrorWaiter(errorMsg: string, waiterID: string) {
	WaiterOrder.locationErrorWaiter(errorMsg, waiterID);
}

export default {
	getWaiterOrders: getOrdersByWaiter,
	orderArrived,
	updateLocationWaiter,
	orderOnTheWay,
	getWaiterName,
	getGuestsDetails,
	locationErrorWaiter,
};
