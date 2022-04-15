import {Location, OrderIDO} from 'api';
import * as WaiterStore from '../Data/Stores/WaiterStore';
import * as OrderStore from '../Data/Stores/OrderStore';

import {getItems} from '../Data/Stores/ItemStore';
import {makeFail, makeGood, mapResponse, ResponseMsg} from '../Response';
import {IOrder} from './IOrder';
import {OrderNotifier} from './OrderNotifier';
import {Waiter} from '../Data/entities/Domain/Waiter';

export class WaiterOrder {
	private static instance: WaiterOrder;
	public static getInstance() {
		if (!this.instance) {
			this.instance = new WaiterOrder();
		}
		return this.instance;
	}

	// waiterToOrders: Map<string, string[]> = new Map();
	// orderToWaiters: Map<string, string[]> = new Map();

	get waiters(): Promise<Waiter[]> {
		return WaiterStore.getWaiters();
	}

	makeAvailable(orderID: string): Promise<ResponseMsg<void>> {
		return OrderStore.removeWaitersFromOrder(orderID);
	}

	async updateWaiterLocation(
		waiterId: string,
		mapId: string,
		location: Location
	) {
		const orders = await this.getOrdersByWaiter(waiterId);
		orders.ifGood(ordersIDs =>
			ordersIDs.forEach(orderID =>
				IOrder.delegate(orderID, o =>
					o.updateWaiterLocation(mapId, location)
				)
			)
		);
	}

	getGuestOrder(guestId: string): ResponseMsg<OrderIDO> {
		const orders = IOrder.orderList;
		const activeOrdersOfGuest = orders.filter(
			order => order.getGuestId() === guestId && order.isActive()
		);
		if (activeOrdersOfGuest.length === 0) {
			return makeFail('Requested guest does not have any active orders');
		}
		const currentOrder = activeOrdersOfGuest[0].getDetails();
		return makeGood(currentOrder);
	}

	// connectWaiter(): ResponseMsg<string> {
	// 	let waiter = new Waiter();
	// 	this.waiterList.push(waiter);
	// 	return makeGood(waiter.id);
	// }

	async assignWaiter(
		orderIDs: string[],
		waiterID: string
	): Promise<ResponseMsg<void>> {
		const waiter = (await this.waiters).find(
			value => value.id === waiterID
		);
		if (waiter === undefined) {
			return makeFail('The requested waiter does not exit', 400);
		}
		if (!waiter.available) {
			return makeFail('The requested waiter is not available', 400);
		}
		const canAssignResponses = orderIDs.map(orderId =>
			IOrder.delegate(orderId, order => makeGood(order.canAssign()))
		);
		const canAssignResponse = mapResponse(canAssignResponses);
		if (canAssignResponse.isSuccess()) {
			const canAssignToOrders = canAssignResponse.getData();
			if (canAssignToOrders.some(can => !can)) {
				return makeFail(
					'All orders must be in a ready status to assign waiters to them',
					400
				);
			}

			// Change the order status
			orderIDs.forEach(orderId =>
				IOrder.delegate(orderId, order => order.assign(waiterID))
			);

			// Saves order <-> waiters assignments
			return await OrderStore.assignWaiter(orderIDs, waiterID);
		}
		return makeFail(canAssignResponse.getError());
	}

	getWaiterByOrder(orderId: string): Promise<ResponseMsg<string[]>> {
		return WaiterStore.getWaitersByOrder(orderId);
	}

	getOrdersByWaiter(waiterId: string): Promise<ResponseMsg<string[]>> {
		return WaiterStore.getOrdersByWaiter(waiterId);
	}

	async createOrder(
		guestId: string,
		items: Map<string, number>
	): Promise<ResponseMsg<string>> {
		const entries = Array.from(items.entries());
		const filteredEntries = entries.filter(
			([_, quantity]) => quantity !== 0
		);
		const quantities = filteredEntries.map(([_, quantity]) => quantity);
		const itemsIds = filteredEntries.map(([id, _]) => id);

		if (filteredEntries.length === 0) {
			return makeFail('You must choose items to order', 400);
		}
		if (quantities.some(quantity => quantity < 0)) {
			return makeFail(
				"You can't order items with negative quantities",
				400
			);
		}
		const allItemsIds: string[] = (await getItems()).map(item => item.id);
		if (itemsIds.some(id => !allItemsIds.includes(id))) {
			return makeFail('The items you chose does not exists', 400);
		}
		const currentOrderResponse = this.getGuestOrder(guestId);
		if (currentOrderResponse.isSuccess()) {
			return makeFail(
				"You can't order while having another order active",
				400
			);
		}

		const newOrder = OrderNotifier.createOrder(
			guestId,
			new Map(filteredEntries)
		);
		IOrder.orderList.push(newOrder);
		return makeGood(newOrder.getID());
	}

	// For testings
	// test_deleteAll(): void {
	// 	this.waiterToOrders.clear();
	// 	this.orderToWaiters.clear();
	// }
}
