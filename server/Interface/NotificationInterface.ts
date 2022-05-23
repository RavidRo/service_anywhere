import {Notifier} from '../Logic/Notification/Notifier';
import { NotificationFacade } from 'server/Logic/Notification/NotificationFacade';

function addSubscriber(
	id: string,
	send: (eventName: string, o: object) => boolean
): void {
	Notifier.getInstance().addSubscriber(id, send);
}

function locationError(
	id: string,
	errorMsg: string
): void {
	const notificationFacade = new NotificationFacade()
	notificationFacade.notifyError(id, errorMsg);
}

export default {
	addSubscriber,
	locationError
};
