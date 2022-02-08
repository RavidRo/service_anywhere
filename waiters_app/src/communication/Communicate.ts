import {Location} from '../ido';
import ConnectionHandler from './ConnectionHandlers';
export default class Communicate {
	private connectionHandler: ConnectionHandler;
	constructor() {
		this.connectionHandler = new ConnectionHandler();
	}

	updateWaiterLocation(...params: [waiterLocation: Location]): void {
		this.connectionHandler.send('updateWaiterLocation', ...params);
	}
}
