import {Location, OrderIDO} from '../../api';

import {ResponseMsg} from '../Response';

import {IOrder} from '../Logic/IOrder';
import {getGuestActiveOrder, onOrder} from '../Logic/Orders';

import WaiterOrder from '../Logic/WaiterOrder';

const guestPermissionLevel = 1;

function createOrder(
	guestID: string,
	items: Map<string, number>
): Promise<ResponseMsg<string>> {
	return WaiterOrder.createOrder(guestID, items);
}

function updateLocationGuest(
	guestID: string,
	location: Location,
	permissionLevel: number
): void {
	if (permissionLevel < guestPermissionLevel) {
		return;
	}

	getGuestOrder(guestID).then(orderResponse => {
		orderResponse.ifGood(order => {
			onOrder(order.id, (o: IOrder) => o.updateGuestLocation(location));
		});
	});
}

async function getGuestOrder(guestID: string): Promise<ResponseMsg<OrderIDO>> {
	return await getGuestActiveOrder(guestID);
}

function submitReview(
	orderID: string,
	details: string,
	rating: number
): Promise<ResponseMsg<void>> {
	return onOrder(orderID, (o: IOrder) => o.giveFeedback(details, rating));
}

async function cancelOrder(
	orderID: string,
	guestID: string
): Promise<ResponseMsg<void>> {
	return WaiterOrder.changeOrderStatus(orderID, 'canceled', guestID);
}

function locationErrorGuest(
	guestID: string,
	errorMsg: string,
	permissionLevel: number
): void {
	if (permissionLevel < guestPermissionLevel) {
		return;
	}
	getGuestOrder(guestID).then(orderResponse =>
		orderResponse.ifGood(order =>
			WaiterOrder.locationErrorGuest(order.id, errorMsg)
		)
	);
}

export default {
	createOrder,
	updateLocationGuest,
	getGuestOrder,
	submitReview,
	cancelOrder,
	locationErrorGuest,
};
