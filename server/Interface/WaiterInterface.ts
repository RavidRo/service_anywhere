import {IOrder} from 'server/Logic/IOrder';
import {makeGood, ResponseMsg} from 'server/Response';
import {Location} from '../../api';
import {WaiterOrder} from '../Logic/WaiterOrder';

function getWaiterOrders(waiterId: string): ResponseMsg<IOrder[]> {
	return WaiterOrder.getWaiterOrder(waiterId).then((data: string[]) => {
		return IOrder.orderList.filter(order => data.includes(order.getId()));
	});
}

function orderArrived(orderId: string): ResponseMsg<void> {
	let response =  IOrder.delegate(orderId, (order: IOrder) => {
		return order.orderArrived();
	});
	if(response.isSuccess()){
		WaiterOrder.makeAvailable(orderId)
	}
	return response
}

function connectWaiter(): ResponseMsg<string> {
	return makeGood(WaiterOrder.connectWaiter());	//todo: if connect waiter response changes, change accordingly
}

function updateLocationWaiter(
	waiterId: string,
	mapId: string,
	location: Location
): ResponseMsg<void> {
	return makeGood(WaiterOrder.updateWaiterLocation(waiterId, mapId, location));
}

function orderOnTheWay(orderId: string): ResponseMsg<void> {
	return IOrder.delegate(orderId, order => {
		return order.changeOrderStatus('on the way')
	});
}

export default {
	getWaiterOrders,
	orderArrived,
	connectWaiter,
	updateLocationWaiter,
	orderOnTheWay,
};
