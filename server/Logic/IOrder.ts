import { OrderNotifier } from "./OrderNotifier";
import { OrderStatus, Location, OrderIDO } from "api";
import { makeFail, ResponseMsg } from "../Response";

export abstract class IOrder {
	static orderList: IOrder[] = []

	static delegate<T, U>(
		orderId: string,
		func: (order: IOrder) => ResponseMsg<T, U>
	): ResponseMsg<T, U> {
		for (const element of this.orderList) {
			if (element.getId() === orderId) {
				return func(element);
			}
		}
		return makeFail('No such order.', 404);
	}

	static createOrder(_guestId: string, _items: Map<string, number>): IOrder{
		throw new Error('abstract method')
	}

	getId(): string{
		throw new Error('abstract method')
	}

	getGuestId(): string{
		throw new Error('abstract method')
	}

	getDetails(): OrderIDO{
		throw new Error('abstract method')
	}

	updateWaiterLocation(_mapId: string, _location: Location): ResponseMsg<string> {
		throw new Error('Method not implemented')
	}

	updateGuestLocation(_mapId: string, _location: Location): ResponseMsg<string> {
		throw new Error('Method not implemented')
	}

	assign(_waiterId: string): ResponseMsg<string> {
		throw new Error('Method not implemented')
	}

	changeOrderStatus(_status: OrderStatus): ResponseMsg<string>{
		throw new Error('abstract method')
	}

	cancelOrderGuest(): boolean{
		throw new Error('abstract method')
	}

	cancelOrderManager(): boolean{
		throw new Error('Method not implemented')
	}

	orderArrived(): ResponseMsg<string>{
		throw new Error('Method not implemented')
	}

	giveFeedback(_review: string, _score: number): boolean{
		throw new Error('Method not implemented')
	}
}
