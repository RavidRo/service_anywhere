import {Location, OrderIDO, OrderStatus} from 'api';
import config from '../config.json';
import {WaiterDAO} from '../Data/entities/Domain/WaiterDAO';
import {getItems} from '../Data/Stores/ItemStore';
import * as OrderStore from '../Data/Stores/OrderStore';
import * as WaiterStore from '../Data/Stores/WaiterStore';
import {makeFail, makeGood, ResponseMsg} from '../Response';
import {NotificationFacade} from './Notification/NotificationFacade';
import {OrderNotifier} from './OrderNotifier';
import {getGuestActiveOrder, onOrder} from './Orders';

const userErrorStatus = 400

export function getAllWaiters(): Promise<WaiterDAO[]> {
	return WaiterStore.getWaiters();
}

export function unassignWaiters(orderID: string): Promise<ResponseMsg<void>> {
	return OrderStore.removeWaitersFromOrder(orderID);
}

export async function updateWaiterLocation(
	waiterID: string,
	location: Location
) {
	const orders = await getOrdersByWaiter(waiterID);
	orders.ifGood(orders =>
		orders.forEach(order =>
			onOrder(order.id, o => o.updateWaiterLocation(waiterID, location))
		)
	);
}

export async function assignWaiter(
	orderID: string,
	waiterIDs: string[]
): Promise<ResponseMsg<void>> {
	const waiters = await Promise.all(
		waiterIDs.map(id => WaiterStore.getWaiter(id))
	);
	if (waiters.includes(null)) {
		return makeFail('A requested waiter does not exit', userErrorStatus);
	}
	const existingWaiters = await getWaiterByOrder(orderID);
	const overlap = waiterIDs.filter(w =>
		existingWaiters.getData().includes(w)
	);
	if (overlap.length > 0) {
		return makeFail(
			'Some requested waiters are already assigned to this order: ' +
				overlap,
			userErrorStatus
		);
	}
	const canAssignResponse = await onOrder(orderID, order =>
		makeGood(order.canAssign())
	);
	if (canAssignResponse.isSuccess()) {
		// Change the order status
		const statusChaneResponse = await onOrder(orderID, order =>
			order.assign(waiterIDs)
		);
		if (!statusChaneResponse.isSuccess()) {
			return statusChaneResponse;
		}

		// Saves order <-> waiters assignments
		return await OrderStore.assignWaiter(orderID, waiterIDs);
	}
	return makeFail(canAssignResponse.getError());
}

export function getWaiterByOrder(
	orderID: string
): Promise<ResponseMsg<string[]>> {
	return WaiterStore.getWaitersByOrder(orderID);
}

export async function getOrdersByWaiter(
	waiterID: string
): Promise<ResponseMsg<OrderIDO[]>> {
	const orders = await WaiterStore.getOrdersByWaiter(waiterID);
	return orders.ifGood(orders => orders.map(order => order.getDetails()));
}

export async function createOrder(
	guestID: string,
	items: Map<string, number>
): Promise<ResponseMsg<string>> {
	const entries = Array.from(items.entries());
	const filteredEntries = entries.filter(([_, quantity]) => quantity !== 0);
	const quantities = filteredEntries.map(([_, quantity]) => quantity);
	const itemsIds = filteredEntries.map(([id, _]) => id);
	if (filteredEntries.length === 0) {
		return makeFail('You must choose items to order', userErrorStatus);
	}
	if (quantities.some(quantity => quantity < 0)) {
		return makeFail("You can't order items with negative quantities", userErrorStatus);
	}
	const allItemsIds: string[] = (await getItems()).map(item => item.id);
	if (itemsIds.some(id => !allItemsIds.includes(id))) {
		return makeFail('The items you chose does not exists', userErrorStatus);
	}
	const currentOrderResponse = await getGuestActiveOrder(guestID);
	if (currentOrderResponse.isSuccess()) {
		return makeFail(
			"You can't order while having another order active",
			userErrorStatus
		);
	}
	const newOrderResponse = await OrderNotifier.createNewOrder(
		guestID,
		new Map(filteredEntries)
	);
	return newOrderResponse.ifGood(newOrder => newOrder.getID());
}

export async function changeOrderStatus(
	orderID: string,
	newStatus: OrderStatus,
	requesterID: string
): Promise<ResponseMsg<void>> {
	const orderDAO = await OrderStore.getOrder(orderID);
	if (!orderDAO) {
		return makeFail('Requested order does not exists');
	}
	if (
		requesterID !== orderDAO.guest.id &&
		orderDAO.waiters.filter(w => w.id === requesterID).length < 1 &&
		requesterID !== config.admin_id
	) {
		return makeFail(
			"The user does not have permission to change this order's status."
		);
	}
	const hasAssignedWaiters = orderDAO.waiters.length > 0;
	const neededWaitersStatuses: OrderStatus[] = ['assigned', 'on the way'];
	const willUnassignWaiters = !neededWaitersStatuses.includes(newStatus);

	const order = OrderNotifier.createOrder(orderDAO);
	const changeStatusResponse = await order.changeOrderStatus(
		newStatus,
		hasAssignedWaiters && !willUnassignWaiters,
		requesterID !== orderDAO.guest.id
	);

	if (changeStatusResponse.isSuccess() && willUnassignWaiters) {
		const response = await unassignWaiters(orderID);
		if (!response.isSuccess()) {
			console.error(
				`Order's status has been changed to ${newStatus} but could not unassign waiters`,
				response.getError()
			);
		}
	}
	return changeStatusResponse;
}

async function getWaiterName(waiterID: string): Promise<ResponseMsg<string>> {
	const response = await WaiterStore.getWaiter(waiterID);
	if (response !== null) {
		return makeGood(response.username);
	} else {
		return makeFail('There is no waiter with that token');
	}
}

export function locationErrorGuest(orderID: string, errorMsg: string) {
	const facade = new NotificationFacade();
	facade.notifyErrorGuest(config.admin_id, errorMsg, orderID);
	getWaiterByOrder(orderID).then(response =>
		response.ifGood(waiters =>
			waiters.forEach(waiter => {
				facade.notifyErrorGuest(waiter, errorMsg, orderID);
			})
		)
	);
}

export function locationErrorWaiter(errorMsg: string, waiterID: string) {
	const facade = new NotificationFacade();
	facade.notifyErrorWaiter(config.admin_id, errorMsg, waiterID);
}

export default {
	createOrder,
	assignWaiter,
	getAllWaiters,
	getOrdersByWaiter,
	getWaiterByOrder,
	makeAvailable: unassignWaiters,
	updateWaiterLocation,
	changeOrderStatus,
	getWaiterName,
	locationErrorGuest,
	locationErrorWaiter,
};
