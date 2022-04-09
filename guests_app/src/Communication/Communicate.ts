import { guestCommunication, Location } from '../signatures';
import ConnectionHandler from './ConnectionHandler';

export default class Communicate implements guestCommunication{
	private connectionHandler: ConnectionHandler;
	constructor() {
		this.connectionHandler = new ConnectionHandler();
	}

	updateGuestLocation(...params: [guestLocation: Location]): void {
		this.connectionHandler.send('updateGuestLocation', ...params);
	}
}
