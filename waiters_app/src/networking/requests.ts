import RequestsHandler from './RequestsHandler';
import {Order as OrderApi, Location as LocationApi} from '../data/api';
import Singleton from '../Singleton';

export default class Requests extends Singleton {
	private handler: RequestsHandler;
	constructor() {
		super();
		this.handler = new RequestsHandler();
	}

	getGuestLocation(orderID: string): Promise<LocationApi> {
		return this.handler
			.get<LocationApi>('getGuestLocation', {orderID})
			.then(location => {
				if (location?.x === undefined || location?.y === undefined) {
					return Promise.reject(
						'The received location is not in the right format'
					);
				}
				return location;
			});
	}

	getWaiterOrders(waiterID: string): Promise<OrderApi[]> {
		return this.handler.get<OrderApi[]>('getWaiterOrders', {waiterID});
	}

	orderArrived(orderID: string): Promise<void> {
		return this.handler.post<void>('orderArrived', {orderID});
	}

	login(): Promise<string> {
		return this.handler.post<string>('connectWaiter');
	}
}
