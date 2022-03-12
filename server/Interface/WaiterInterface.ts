import {stringify} from 'querystring';
import {makeGood, ResponseMsg} from 'server/Response';
import {Location} from '../../api';
import {Order} from '../Logic/Order';
import {WaiterOrder} from '../Logic/WaiterOrder';

function getWaiterOrders(waiterId: string): ResponseMsg<Order[]> {
	return WaiterOrder.getWaiterOrder(waiterId).then((data: string[]) => {
		return Order.orderList.filter(order => data.includes(order.id));
	});
}

function getGuestLocation(orderId: string): ResponseMsg<Location> {
	return Order.getGuestLocation(orderId);
}

function orderArrived(orderId: string): void {
	Order.delegate(orderId, (order: Order) => {
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

function orderOnTheWay(orderId: string): void{
	orderId
	throw new Error('Method not implemented')
}



export default {
	getWaiterOrders,
	getGuestLocation,
	orderArrived,
	connectWaiter,
	updateLocationWaiter,
	orderOnTheWay
};
