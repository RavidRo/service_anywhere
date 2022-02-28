import {ResponseMsg} from 'server/Response';
import {Api, Arrived, Location, OrderID} from '../api';
import {Order} from '../Logic/Order';

function createOrder(items: string[]): OrderID {
	return Order.createOrder(items);
}

function updateLocationGuest(location: Location, orderID: OrderID): void {
	Order.delegate(orderID, (order: Order) =>
		order.updateLocationGuest(location)
	);
}

function hasOrderArrived(orderID: OrderID): ResponseMsg<Arrived> {
	return Order.delegate(orderID, (order: Order) => order.hasOrderArrived());
}

export default {
	createOrder,
	updateLocationGuest,
	hasOrderArrived,
};
