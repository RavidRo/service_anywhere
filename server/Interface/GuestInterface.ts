import {IOrder} from 'server/Logic/IOrder';
import {makeGood, ResponseMsg} from 'server/Response';
import {Location, OrderIDO} from '../../api';
import {WaiterOrder} from '../Logic/WaiterOrder';

function createOrder(guestId: string, items: Map<string, number>): string {
	return WaiterOrder.createOrder(guestId, items);
}

function updateLocationGuest(
	guestId: string,
	mapId: string,
	location: Location
): void {
	IOrder.delegate(getGuestOrder(guestId).id, (o: IOrder) =>
		o.updateGuestLocation(mapId, location)
	);
}

function getGuestOrder(guestId: string): OrderIDO {
	return WaiterOrder.getGuestOrder(guestId);
}

function submitReview(orderId: string, details: string, rating: number): void {
	orderId;
	details;
	rating;
	throw new Error('Method not implemented');
}

function cancelOrder(orderId: string): Boolean {
	return IOrder.delegate(orderId, o => {
		o.cancelOrderGuest();
		return makeGood();
	}).isSuccess();
}

export default {
	createOrder,
	updateLocationGuest,
	getGuestOrder,
	submitReview,
	cancelOrder,
};
