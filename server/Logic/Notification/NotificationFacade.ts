import {Location, OrderIDO, OrderStatus} from 'api';
import {Notifier} from './Notifier';

export class NotificationFacade {
	private notifier: Notifier = Notifier.getInstance();

	public newOrder(receiverID: string, order: OrderIDO) {
		this.notifier.notify(receiverID, 'newOrder', {order});
		//console.debug('newOrder', receiverID);
	}

	public assignedToOrder(receiverID: string, order: OrderIDO) {
		this.notifier.notify(receiverID, 'assignedToOrder', {order});
		//console.debug('assignToOrder', receiverID);
	}

	public updateGuestLocation(
		receiverID: string,
		guestID: string,
		location: Location
	) {
		this.notifier.notify(receiverID, 'updateGuestLocation', {
			guestID,
			location,
		});
		//console.debug('updateGuestLocation', receiverID);
	}

	public updateWaiterLocation(
		receiverID: string,
		orderID: string,
		location: Location
	) {
		this.notifier.notify(receiverID, 'updateWaiterLocation', {
			orderID,
			location,
		});
		//console.debug('updateWaiterLocation', receiverID);
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
		//console.debug('changeOrderStatus', receiverID);
	}

	public notifyError(receiverID: string, errorMsg: string) {
		this.notifier.notify(receiverID, 'error', {errorMsg});
	}
}
