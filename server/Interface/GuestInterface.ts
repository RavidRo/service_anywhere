import {Location, OrderIDO} from '../../api';

import {ResponseMsg} from '../Response';

import {IOrder} from '../Logic/IOrder';
import {onOrder, getGuestActiveOrder} from '../Logic/Orders';

import WaiterOrder from '../Logic/WaiterOrder';

function createOrder(
	guestID: string,
	items: Map<string, number>
): Promise<ResponseMsg<string>> {
	return WaiterOrder.createOrder(guestID, items);
}

function updateLocationGuest(guestID: string, location: Location): void {
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

function locationErrorGuest(guestID: string, errorMsg: string): void {
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
