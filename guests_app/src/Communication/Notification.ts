import {isLocation, isOrderStatus, isString} from 'guests_app/typeGuards';
import Requests from '../Networking/requests';
import OrderViewModel from '../ViewModel/OrderViewModel';

export default class Notifications {
	private orders: OrderViewModel;
	public eventToCallback: Record<string, (params: unknown[]) => void> = {
		waiterLocationUpdate: params => this.waiterLocationUpdate(params),
		orderStatusChange: params => this.orderStatusChange(params),
	};

	constructor() {
		this.orders = new OrderViewModel(new Requests());
	}

	// should remain with params: unknown[] ?
	private waiterLocationUpdate(params: unknown[]): void {
		if (params.length >= 2) {
			if (isString(params[0]) && isLocation(params[1])) {
				const waiterID = params[0];
				const waiterLocation = params[1];
				this.orders.updateWaiterLocation(waiterID, waiterLocation);
				return;
			}
		}
		console.warn(
			`In the event, "waiterLocationUpdate", parameters ${params} are not in the right format`
		);
	}

	private orderStatusChange(params: unknown[]): void {
		if (params.length >= 2) {
			if (isString(params[0]) && isOrderStatus(params[1])) {
				const orderID = params[0];
				const orderStatus = params[1];
				this.orders.updateOrderStatus(orderID, orderStatus);
				return;
			}
		}
		console.warn(
			`In the event, "waiterLocationUpdate", parameters ${params} are not in the right format`
		);
	}
}
