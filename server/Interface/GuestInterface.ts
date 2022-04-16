import {Location, OrderIDO} from '../../api';

import {ResponseMsg} from '../Response';

import {onOrder, IOrder, getGuestActiveOrder} from '../Logic/IOrder';
import WaiterOrder from '../Logic/WaiterOrder';

function createOrder(
	guestId: string,
	items: Map<string, number>
): Promise<ResponseMsg<string>> {
	return WaiterOrder.createOrder(guestId, items);
}

async function updateLocationGuest(
	guestId: string,
	mapId: string,
	location: Location
): Promise<ResponseMsg<void>> {
	return (await getGuestOrder(guestId)).ifGood(order => {
		onOrder(order.id, (o: IOrder) =>
			o.updateGuestLocation(mapId, location)
		);
	});
}

async function getGuestOrder(guestId: string): Promise<ResponseMsg<OrderIDO>> {
	return await getGuestActiveOrder(guestId);
}

function submitReview(orderId: string, details: string, rating: number): void {
	orderId;
	details;
	rating;
	throw new Error('Method not implemented');
}

async function cancelOrder(orderId: string): Promise<ResponseMsg<void>> {
	const response = await onOrder(orderId, o => {
		return o.cancelOrder();
	});
	return response.ifGood(() => {
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
