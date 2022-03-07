import {stringify} from 'querystring';
import {makeGood, ResponseMsg} from 'server/Response';
import {Location, OrderID, WaiterID} from '../api';
import {Order} from '../Logic/Order';
import {WaiterOrder} from '../Logic/WaiterOrder';

function getWaiterOrder(waiterID: WaiterID): ResponseMsg<Order[]> {
	return WaiterOrder.getWaiterOrder(waiterID).then((data: string[]) => {
		return Order.orderList.filter(order => data.includes(order.id));
	});
}

function getGuestLocation(orderID: OrderID): ResponseMsg<Location> {
	return Order.getGuestLocation(orderID);
}

function orderArrived(orderID: OrderID): void {
	Order.delegate(orderID, (order: Order) => {
		order.orderArrived();
		return makeGood();
	});
}

function connectWaiter(): string {
	return WaiterOrder.connectWaiter();
}

function updateLocationWaiter(
	waiterId: string,
	mapId: string,
	location: Location
): string {
	waiterId;
	mapId;
	location;
	return '';
	//todo: this
}

export default {
	getWaiterOrder,
	getGuestLocation,
	orderArrived,
	connectWaiter,
	updateLocationWaiter,
};
