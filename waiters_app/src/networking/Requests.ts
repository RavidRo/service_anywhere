import RequestsHandler from './RequestsHandler';
import Singleton from '../Singleton';
import {ItemIdo, Location, OrderIdo} from '../ido';

export default class Requests extends Singleton {
	private handler: RequestsHandler;
	constructor() {
		super();
		this.handler = new RequestsHandler();
	}

	getGuestLocation(orderID: string): Promise<Location> {
		return this.handler
			.get<Location>('getGuestLocation', {orderID})
			.then(location => {
				if (location?.x === undefined || location?.y === undefined) {
					return Promise.reject(
						'The received location is not in the right format'
					);
				}
				return location;
			});
	}

	getWaiterOrders(): Promise<OrderIdo[]> {
		return this.handler.get<OrderIdo[]>('getWaiterOrders');
	}

	orderArrived(orderID: string): Promise<void> {
		return this.handler.post<void>('orderArrived', {orderID});
	}

	login(): Promise<string> {
		return this.handler.post<string>('connectWaiter');
	}

	getItems(): Promise<ItemIdo[]> {
		return this.handler.get<ItemIdo[]>('getItems');
	}
}
