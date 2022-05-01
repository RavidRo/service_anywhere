import Requests from '../networking/Requests';
import {isLocation, isOrderStatus, isString} from '../typeGuards';
import {ItemViewModel} from '../ViewModel/ItemViewModel';
import OrderViewModel from '../ViewModel/OrderViewModel';

type Params = {[param: string]: unknown};
export default class Notifications {
	private orders: OrderViewModel;
	public eventToCallback: Record<string, (params: Params) => void> = {
		updateGuestLocation: params => this.updateGuestLocation(params),
		changeOrderStatus: params => this.updateOrderStatus(params),
	};

	constructor(requests: Requests, itemViewModel: ItemViewModel) {
		this.orders = new OrderViewModel(requests, itemViewModel);
	}

	private updateGuestLocation(params: Params): void {
		const guestID = params.guestId;
		const guestLocation = params.location;
		if (isString(guestID) && isLocation(guestLocation)) {
			this.orders.updateGuestLocation(guestID, guestLocation);
			return;
		}

		console.warn(
			`In the event, "updateGuestLocation", parameters ${params} are not in the right format`
		);
	}

	private updateOrderStatus(params: Params): void {
		const orderID = params.orderID;
		const status = params.orderStatus;
		if (isString(orderID) && isOrderStatus(status)) {
			this.orders.updateOrderStatus(orderID, status);
			return;
		}

		console.warn(
			`In the event, "updateOrderStatus", parameters ${params} are not in the right format`
		);
	}
}
