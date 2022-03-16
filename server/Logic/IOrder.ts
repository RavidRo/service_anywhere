import { OrderNotifier } from "./OrderNotifier";

export abstract class IOrder {
	static createOrder(id: string, items: Map<string, number>): IOrder{
		return OrderNotifier.createOrder(id, items)
	}

	getId(): string{
		throw new Error('abstract method')
	}

	updateWaiterLocation(mapId: string, location: Location): void {
		mapId;
		location;
		throw new Error('Method not implemented')
		//todo: this
	}
}
