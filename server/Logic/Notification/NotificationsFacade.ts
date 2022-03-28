import {Location, OrderIDO, OrderStatus} from 'api';
import {Notifier} from './Notifier';

export class NotificationFacade {
	private notifier: Notifier = new Notifier();

	public newOrder(receiverID: string, order: OrderIDO) {
		this.notifier.notify(receiverID, 'newOrder', {order});
	}

	public updateGuestLocation(
		receiverID: string,
		orderID: string,
		mapID: string,
		location: Location
	) {
		this.notifier.notify(receiverID, 'updateGuestLocation', {
			orderID,
			mapID,
			location,
		});
	}

	public changeOrderStatus(
		receiverID: string,
		orderID: string,
		orderStatus: OrderStatus
	) {
		this.notifier.notify(receiverID, 'changeOrderStatus', {
			orderID,
			orderStatus,
		});
	}
}
