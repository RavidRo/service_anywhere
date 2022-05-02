import {guestCommunication} from '../signatures';
import { LocationCoordinates } from '../types';
import ConnectionHandler from './ConnectionHandler';

export default class Communicate implements guestCommunication {
	private connectionHandler: ConnectionHandler;
	constructor() {
		this.connectionHandler = new ConnectionHandler();
	}

	updateGuestLocation(...params: [guestLocation: LocationCoordinates]): void {
		this.connectionHandler.send('updateGuestLocation', ...params);
	}
}
