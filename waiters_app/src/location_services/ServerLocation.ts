import {LocationService} from './LocationService';
import requests from '../networking/requests';
import Location from '../data/Location';

export default class ServerLocation implements LocationService {
	private orderID: string;
	private timer: NodeJS.Timer | undefined;

	constructor(orderID: string) {
		this.orderID = orderID;
	}

	getLocation(
		successCallback: (_location: Location) => void,
		errorCallback: (_error: string) => void
	): void {
		requests
			.getGuestLocation(this.orderID)
			.then(successCallback)
			.catch(errorCallback);
	}
	watchLocation(
		successCallback: (_location: Location) => void,
		errorCallback: (_error: string) => void
	): void {
		if (this.timer) {
			clearInterval(this.timer);
		}
		this.timer = setInterval(
			() =>
				requests
					.getGuestLocation(this.orderID)
					.then(successCallback)
					.catch(e => {
						errorCallback(e);
						this.stopWatching();
					}),
			1000
		);
	}
	stopWatching(): void {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}
}
