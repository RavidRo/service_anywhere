import {LocationService} from './LocationService';
import Location from '../data/Location';
import Requests from '../networking/requests';

export default class ServerLocation implements LocationService {
	private orderID: string;
	private timer: NodeJS.Timer | undefined;
	private requests: Requests;

	constructor(orderID: string) {
		this.orderID = orderID;
		this.requests = new Requests();
	}

	getLocation(
		successCallback: (_location: Location) => void,
		errorCallback: (_error: string) => void
	): void {
		this.requests
			.getGuestLocation(this.orderID)
			.then(location => {
				successCallback(new Location(location.x, location.y));
			})
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
				this.requests
					.getGuestLocation(this.orderID)
					.then(location => {
						successCallback(new Location(location.x, location.y));
					})
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
