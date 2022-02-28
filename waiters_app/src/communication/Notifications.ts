import Requests from '../networking/Requests';
import {isLocation, isOrderStatus, isString} from '../typeGuards';
import OrderViewModel from '../ViewModel/OrderViewModel';

export default class Notifications {
	private orders: OrderViewModel;
	public eventToCallback: Record<string, (params: unknown[]) => void> = {
		updateGuestLocation: params => this.updateGuestLocation(params),
		updateOrderStatus: params => this.updateOrderStatus(params),
	};

	constructor() {
		this.orders = new OrderViewModel(new Requests());

		// for (const event in this.eventToCallback) {
		// 	this.eventToCallback[event].bind(this);
		// }
	}

	private updateGuestLocation(params: unknown[]): void {
		if (params.length >= 2) {
			if (isString(params[0]) && isLocation(params[1])) {
				const guestID = params[0];
				const guestLocation = params[1];
				this.orders.updateGuestLocation(guestID, guestLocation);
				return;
			}
		}
		console.error('Parameters are not in the right format');
	}

	private updateOrderStatus(params: unknown[]): void {
		if (params.length >= 2) {
			if (isString(params[0]) && isOrderStatus(params[1])) {
				const orderID = params[0];
				const status = params[1];
				this.orders.updateOrderStatus(orderID, status);
				return;
			}
		}
		console.error('Parameters are not in the right format');
	}
}
