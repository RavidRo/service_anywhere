import { OrderNotifier } from "./OrderNotifier";
import { OrderStatus, Location, OrderIDO } from "api";
import { ResponseMsg } from "server/Response";

export abstract class IOrder {
	static createOrder(guestId: string, items: Map<string, number>): IOrder{
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

	updateWaiterLocation(mapId: string, location: Location): ResponseMsg<string> {
		throw new Error('Method not implemented')
	}

	updateGuestLocation(mapId: string, location: Location): ResponseMsg<string> {
		throw new Error('Method not implemented')
	}

	assign(waiterId: string): ResponseMsg<string> {
		throw new Error('Method not implemented')
	}

	changeOrderStatus(status: OrderStatus): ResponseMsg<string>{
		throw new Error('abstract method')
	}

	cancelOrderGuest(guestId: string){
		throw new Error('abstract method')
	}

	cancelOrderManager(): boolean{
		throw new Error('Method not implemented')
	}

	giveFeedback(review: string, score: number): boolean{
		throw new Error('Method not implemented')
	}
}
