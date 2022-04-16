import {Location} from '../../api';

import {makeGood, ResponseMsg} from '../Response';

import {onOrder, IOrder, getOrders} from '../Logic/IOrder';
import WaiterOrder from '../Logic/WaiterOrder';

async function getWaiterOrders(
	waiterID: string
): Promise<ResponseMsg<IOrder[]>> {
	const ordersResponse = await WaiterOrder.getOrdersByWaiter(waiterID);

	if (ordersResponse.isSuccess()) {
		const ordersIDs = ordersResponse.getData();
		return makeGood(await getOrders(ordersIDs));
	}
	return ordersResponse as any as ResponseMsg<IOrder[]>;
}

async function orderArrived(orderId: string): Promise<ResponseMsg<void>> {
	const response = await onOrder(orderId, (order: IOrder) => {
		return order.orderArrived();
	});
	return response.ifGood(() => {
		WaiterOrder.makeAvailable(orderId);
	});
}

function updateLocationWaiter(
	waiterId: string,
	mapId: string,
	location: Location
): void {
	WaiterOrder.updateWaiterLocation(waiterId, mapId, location);
}

async function orderOnTheWay(orderId: string): Promise<ResponseMsg<void>> {
	return await onOrder(orderId, order => {
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
