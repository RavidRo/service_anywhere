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
		waiterID: string,
		location: Location
	) {
		this.notifier.notify(receiverID, 'updateWaiterLocation', {
			waiterID,
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

	public notifyErrorGuest(
		receiverID: string,
		errorMsg: string,
		orderId: string
	) {
		this.notifier.notify(receiverID, 'errorGuest', {
			errorMsg: errorMsg,
			orderId: orderId,
		});
	}

	public notifyErrorWaiter(
		receiverID: string,
		errorMsg: string,
		waiterId: string
	) {
		this.notifier.notify(receiverID, 'errorWaiter', {
			errorMsg: errorMsg,
			waiterId: waiterId,
		});
	}
}
