import {IOrder} from 'server/Logic/IOrder';
import {makeGood, ResponseMsg} from 'server/Response';
import {Location} from '../../api';
import {WaiterOrder} from '../Logic/WaiterOrder';

function getWaiterOrders(waiterId: string): ResponseMsg<IOrder[]> {
	return WaiterOrder.getWaiterOrder(waiterId).then((data: string[]) => {
		return IOrder.orderList.filter(order => data.includes(order.getId()));
	});
}

function orderArrived(orderId: string): void {
	let response = IOrder.delegate(orderId, (order: IOrder) => {
		return order.orderArrived();
	});
	if(response.isSuccess()){
		WaiterOrder.makeAvailable(orderId)
	}
}

function connectWaiter(): string {
	return WaiterOrder.connectWaiter();
}

function updateLocationWaiter(
	waiterId: string,
	mapId: string,
	location: Location
): void {
	WaiterOrder.updateWaiterLocation(waiterId, mapId, location);
}

function orderOnTheWay(orderId: string): void {	//todo: implement this
	orderId;
	throw new Error('Method not implemented');
}

export default {
	getWaiterOrders,
	orderArrived,
	connectWaiter,
	updateLocationWaiter,
	orderOnTheWay,
};
