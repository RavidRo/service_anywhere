import Location from "../types";
import ConnectionHandler from "./ConnectionHandler";

export default class Communicate {
	private connectionHandler: ConnectionHandler;
	constructor() {
		this.connectionHandler = new ConnectionHandler();
	}

	updateGuestLocation(...params: [guestLocation: Location]): void {
		this.connectionHandler.send('updateGuestLocation', ...params);
	}
}