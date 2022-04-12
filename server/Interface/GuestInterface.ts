import {IOrder} from 'server/Logic/IOrder';
import {makeGood, ResponseMsg} from 'server/Response';
import {Location, OrderIDO} from '../../api';
import {WaiterOrder} from '../Logic/WaiterOrder';

function createOrder(
	guestId: string,
	items: Map<string, number>
): ResponseMsg<string> {
	return WaiterOrder.createOrder(guestId, items);
}

function updateLocationGuest(
	guestId: string,
	mapId: string,
	location: Location
): void {
	getGuestOrder(guestId).then(order => {
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

function cancelOrder(orderId: string): boolean {	//todo: should probably not be boolean
	let response = IOrder.delegate(orderId, o => {
		o.cancelOrder();	//todo: if cancelOrder returns a responseMsg, remove the makeGood
		return makeGood();
	})
	if(response.isSuccess()){
		WaiterOrder.makeAvailable(orderId);
	}
	return response.isSuccess();
}

export default {
	createOrder,
	updateLocationGuest,
	getGuestOrder,
	submitReview,
	cancelOrder,
};
