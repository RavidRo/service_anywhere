import RequestsHandler from './RequestsHandler';
import Singleton from '../Singleton';

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

	getWaiterOrders(waiterID: string): Promise<OrderIdo[]> {
		return this.handler.get<OrderIdo[]>('getWaiterOrders', {waiterID});
	}

	orderArrived(orderID: string): Promise<void> {
		return this.handler.post<void>('orderArrived', {orderID});
	}

	login(): Promise<string> {
		return this.handler.post<string>('connectWaiter');
	}
}
