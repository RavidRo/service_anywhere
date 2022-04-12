import {Location, OrderIDO} from 'api';
import {makeFail, makeGood, mapResponse, ResponseMsg} from '../Response';
import {IOrder} from './IOrder';
import {OrderNotifier} from './OrderNotifier';
import {Waiter} from './Waiter';

export class WaiterOrder {
	static waiterList: Waiter[] = [];
	static waiterToOrders: Map<string, string[]> = new Map();
	static orderToWaiters: Map<string, string[]> = new Map();

	static makeAvailable(orderId: string) {
		let waiters = this.orderToWaiters.get(orderId);
		waiters?.forEach(waiterId => {
			this.waiterList
				.filter(waiter => waiter.id === waiterId)
				.forEach(w => (w.available = true));
		});
	}

	static updateWaiterLocation(
		waiterId: string,
		mapId: string,
		location: Location
	) {
		let waiterOrders = this.waiterToOrders.get(waiterId);
		if (waiterOrders) {
			waiterOrders.forEach(order => {
				IOrder.delegate(order, o =>
					o.updateWaiterLocation(mapId, location)
				);
			});
		}
	}

	static getGuestOrder(guestId: string): ResponseMsg<OrderIDO> {
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

	static connectWaiter(): string {
		let waiter = new Waiter();
		this.waiterList.push(waiter);
		return waiter.id;
	}

	static assignWaiter(
		orderIds: string[],
		waiterId: string
	): ResponseMsg<void> {
		let waiter = this.waiterList.find(value => value.id === waiterId);
		if (waiter === undefined) {
			return makeFail('The requested waiter does not exit', 400);
		}
		if (!waiter.available) {
			return makeFail('The requested waiter is not available', 400);
		}
		const canAssignResponses = orderIds.map(orderId =>
			IOrder.delegate(orderId, order => makeGood(order.canAssign()))
		);
		return mapResponse(canAssignResponses).then(canAssignToOrders => {
			if (canAssignToOrders.some(can => !can)) {
				return makeFail(
					'All orders must be in a ready status to assign waiters to them',
					400
				);
			}

			// Change the order status
			orderIds.forEach(orderId =>
				IOrder.delegate(orderId, order => order.assign(waiterId))
			);

			// Saves order <-> waiters assignments
			const orders = this.waiterToOrders.get(waiterId);
			if (orders) {
				orders.push(...orderIds);
			} else {
				this.waiterToOrders.set(waiterId, orderIds);
			}

			orderIds.forEach(orderID => {
				const waiters = this.orderToWaiters.get(orderID);
				if (waiters) {
					waiters.push(waiterId);
				} else {
					this.orderToWaiters.set(orderID, [waiterId]);
				}
			});

			waiter!.available = false;

			return makeGood();
		});
	}

	static getWaiterByOrder(orderId: string): ResponseMsg<string[]> {
		let waiters = this.orderToWaiters.get(orderId);
		if (waiters) {
			return makeGood(waiters);
		}
		return makeGood([]);
	}

	static getWaiterOrder(waiterId: string): ResponseMsg<string[]> {
		let orders = this.waiterToOrders.get(waiterId);
		if (orders) {
			return makeGood(orders);
		}
		return makeGood([]);
	}

	static createOrder(
		guestId: string,
		items: Map<string, number>
	): ResponseMsg<string> {
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
		const allItemsIds: string[] = []; //TODO: get all item ids from DB
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

		const newOrder = OrderNotifier.createOrder(guestId, items);
		IOrder.orderList.push(newOrder);
		return makeGood(newOrder.getId());
	}

	static unassignWaiters(orderId: string){
		let waiters = this.orderToWaiters.get(orderId)
		waiters?.forEach((waiterId) => {
			let waiterOrders = this.waiterToOrders.get(waiterId)
			if(waiterOrders !== undefined){
				this.waiterToOrders.set(waiterId, waiterOrders.filter((order) => order !== orderId))
			}
		})
		this.orderToWaiters.delete(orderId)
	}
}
