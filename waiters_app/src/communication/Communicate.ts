import {Location} from '../ido';
import Requests from '../networking/Requests';
import Singleton from '../Singleton';
import {ItemViewModel} from '../ViewModel/ItemViewModel';
import ConnectionHandler from './ConnectionHandler';

export default class Communicate extends Singleton {
	private connectionHandler: ConnectionHandler;
	constructor(requests: Requests, itemViewModel: ItemViewModel) {
		super();
		this.connectionHandler = new ConnectionHandler(requests, itemViewModel);
	}

	updateWaiterLocation(...params: [waiterLocation: Location]): void {
		this.connectionHandler.send('updateWaiterLocation', ...params);
	}
}
