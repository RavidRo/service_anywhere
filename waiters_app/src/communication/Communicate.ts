import {Location} from '../ido';
import Singleton from '../Singleton';
import ConnectionHandler from './ConnectionHandler';

export default class Communicate extends Singleton {
	private connectionHandler: ConnectionHandler;
	constructor() {
		super();
		this.connectionHandler = new ConnectionHandler();
	}

	updateWaiterLocation(...params: [waiterLocation: Location]): void {
		this.connectionHandler.send('updateWaiterLocation', ...params);
	}
}
