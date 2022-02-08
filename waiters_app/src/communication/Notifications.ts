import {isLocation, isOrderStatus, isString} from '../typeGuards';
import OrdersViewModel from '../ViewModel/OrdersViewModel';

export default class Notifications {
	private orders = new OrdersViewModel();
	public eventToCallback: Record<string, (params: any[]) => void> = {
		updateGuestLocation: this.updateGuestLocation,
		updateOrderStatus: this.updateOrderStatus,
	};

	private updateGuestLocation(params: any[]): void {
		if (params.length === 2) {
			if (isString(params[0]) && isLocation(params[1])) {
				const guestID = params[0];
				const guestLocation = params[1];
				this.orders.updateGuestLocation(guestID, guestLocation);
				return;
			}
		}
		console.error('Parameters are not in the right format');
	}

	private updateOrderStatus(params: any[]): void {
		if (params.length === 2) {
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
