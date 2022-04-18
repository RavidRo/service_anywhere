import {Location, OrderIDO} from '../../api';

import {ResponseMsg} from '../Response';

import {IOrder} from '../Logic/IOrder';
import {onOrder, getGuestActiveOrder} from '../Logic/Orders';

import WaiterOrder from '../Logic/WaiterOrder';

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
): void {
	getGuestOrder(guestId).then(orderResponse => {
		orderResponse.ifGood(order => {
			onOrder(order.id, (o: IOrder) =>
				o.updateGuestLocation(mapId, location)
			);
		});
	});
}

async function getGuestOrder(guestId: string): Promise<ResponseMsg<OrderIDO>> {
	return await getGuestActiveOrder(guestId);
}

function submitReview(
	orderId: string,
	details: string,
	rating: number
): ResponseMsg<void> {
	orderId;
	details;
	rating;
	throw new Error('Method not implemented');
}

async function cancelOrder(orderId: string): Promise<ResponseMsg<void>> {
	const response = await onOrder(orderId, o => {
		return o.changeOrderStatus('canceled', false, false);
	});
	return response.ifGood(() => {
		// TODO: check response
		WaiterOrder.makeAvailable(orderId);
	});
}

export default {
	createOrder,
	updateLocationGuest,
	getGuestOrder,
	submitReview,
	cancelOrder,
};
