import {Location} from '../../api';

import {makeGood, ResponseMsg} from '../Response';

import {IOrder} from '../Logic/IOrder';
import {WaiterOrder} from '../Logic/WaiterOrder';

function getWaiterOrders(waiterId: string): ResponseMsg<IOrder[]> {
	return WaiterOrder.getInstance()
		.getWaiterOrder(waiterId)
		.ifGood((data: string[]) => {
			return IOrder.orderList.filter(order =>
				data.includes(order.getID())
			);
		});
}

function orderArrived(orderId: string): ResponseMsg<void> {
	const response = IOrder.delegate(orderId, (order: IOrder) => {
		return order.orderArrived();
	});
	return response.ifGood(() => {
		WaiterOrder.getInstance().makeAvailable(orderId);
	});
}

// function connectWaiter(): ResponseMsg<string> {
// 	return WaiterOrder.getInstance().connectWaiter();
// }

function updateLocationWaiter(
	waiterId: string,
	mapId: string,
	location: Location
): ResponseMsg<void> {
	return makeGood(
		WaiterOrder.getInstance().updateWaiterLocation(
			waiterId,
			mapId,
			location
		)
	);
}

function orderOnTheWay(orderId: string): ResponseMsg<void> {
	return IOrder.delegate(orderId, order => {
		return order.changeOrderStatus('on the way');
	});
}

export default {
	getWaiterOrders,
	orderArrived,
	// connectWaiter,
	updateLocationWaiter,
	orderOnTheWay,
};
