import {Location, OrderIDO} from '../../api';

import {makeFail, makeGood, ResponseMsg} from '../Response';

import {IOrder} from '../Logic/IOrder';
import {onOrder, getGuestActiveOrder} from '../Logic/Orders';

import WaiterOrder from '../Logic/WaiterOrder';
import {logger} from 'server/Logger';

function createOrder(
	guestId: string,
	items: Map<string, number>
): Promise<ResponseMsg<string>> {
	return WaiterOrder.createOrder(guestId, items);
}

function updateLocationGuest(guestId: string, location: Location): void {
	getGuestOrder(guestId).then(orderResponse => {
		orderResponse.ifGood(order => {
			onOrder(order.id, (o: IOrder) => o.updateGuestLocation(location));
		});
	});
}

async function getGuestOrder(guestID: string): Promise<ResponseMsg<OrderIDO>> {
	return await getGuestActiveOrder(guestID);
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

async function cancelOrder(
	orderID: string,
	guestID: string
): Promise<ResponseMsg<void>> {
	return WaiterOrder.changeOrderStatus(orderID, 'canceled', guestID);
}

export default {
	createOrder,
	updateLocationGuest,
	getGuestOrder,
	submitReview,
	cancelOrder,
};
