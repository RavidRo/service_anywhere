import {OrderStatus, Location, OrderIDO} from 'api';
import {makeFail, ResponseMsg} from '../Response';

export abstract class IOrder {
	static orderList: IOrder[] = [];

	static delegate<T, U>(
		orderId: string,
		func: (order: IOrder) => ResponseMsg<T, U>
	): ResponseMsg<T, U> {
		for (const element of this.orderList) {
			if (element.getID() === orderId) {
				return func(element);
			}
		}
		return makeFail('No such order.', 404);
	}

	static createOrder(_guestId: string, _items: Map<string, number>): IOrder {
		throw new Error('abstract method');
	}

	abstract getID(): string;

	abstract getGuestId(): string;

	abstract getDetails(): OrderIDO;

	abstract updateWaiterLocation(
		_mapId: string,
		_location: Location
	): ResponseMsg<void>;

	abstract updateGuestLocation(
		_mapId: string,
		_location: Location
	): ResponseMsg<void>;

	abstract canAssign(): boolean;

	abstract assign(_waiterId: string): ResponseMsg<void>;

	abstract changeOrderStatus(_status: OrderStatus): ResponseMsg<void>;

	abstract cancelOrder(): ResponseMsg<void>;

	abstract orderArrived(): ResponseMsg<void>;

	abstract giveFeedback(_review: string, _score: number): boolean;

	abstract isActive(): boolean;

	// For testings
	static test_deleteAllOrders(): void {
		this.orderList = [];
	}
}
