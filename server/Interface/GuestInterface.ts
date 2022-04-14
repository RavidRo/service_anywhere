import {Location, OrderIDO} from '../../api';

import {makeGood, ResponseMsg} from '../Response';

import {IOrder} from '../Logic/IOrder';
import {WaiterOrder} from '../Logic/WaiterOrder';

function createOrder(
	guestId: string,
	items: Map<string, number>
): Promise<ResponseMsg<string>> {
	return WaiterOrder.createOrder(guestId, items);
}

function updateLocationGuest(
	guestId: string,
	mapId: string,
	location: Location
): ResponseMsg<void> {
	return getGuestOrder(guestId).ifGood(order => {
		IOrder.delegate(order.id, (o: IOrder) =>
			o.updateGuestLocation(mapId, location)
		);
	});
}

function getGuestOrder(guestId: string): ResponseMsg<OrderIDO> {
	return WaiterOrder.getGuestOrder(guestId);
}

function submitReview(orderId: string, details: string, rating: number): void {
	orderId;
	details;
	rating;
	throw new Error('Method not implemented');
}

function cancelOrder(orderId: string): ResponseMsg<void> {
	let response = IOrder.delegate(orderId, o => {
		return o.cancelOrder();
	});
	if (response.isSuccess()) {
		WaiterOrder.makeAvailable(orderId);
	}
	return response;
}

export default {
	createOrder,
	updateLocationGuest,
	getGuestOrder,
	submitReview,
	cancelOrder,
};
