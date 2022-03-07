import ConnectionHandler from '../communication/ConnectionHandler';
import ConnectionModel from '../Models/ConnectionModel';
import Requests from '../networking/Requests';
import {ItemViewModel} from './ItemViewModel';
import MyLocationViewModel from './MyLocationViewModel';
import OrderViewModel from './OrderViewModel';

export default class ConnectionViewModel {
	private requests: Requests;
	private model: ConnectionModel;
	private connection: ConnectionHandler;
	private orders: OrderViewModel;
	private items: ItemViewModel;
	private myLocation: MyLocationViewModel;

	constructor(requests: Requests) {
		this.model = ConnectionModel.getInstance();
		this.requests = requests;
		this.connection = new ConnectionHandler();
		this.orders = new OrderViewModel(requests);
		this.items = new ItemViewModel(requests);
		this.myLocation = new MyLocationViewModel();
	}

	login(): Promise<string> {
		return this.requests.login().then(token => {
			this.model.token = token;
			return token;
		});
	}

	get token(): string | undefined {
		return this.model.token;
	}

	get isReconnecting(): boolean {
		return this.model.reconnectingToServer;
	}

	public connect() {
		const promises = [
			this.orders.synchronizeOrders(),
			this.items.syncItems(),
			new Promise<void>((resolve, reject) => {
				if (this.token) {
					this.connection.connect(this.token, () => resolve());
				} else {
					reject(
						'Tried to connect but an authorization token could not be found'
					);
				}
			}),
		];

		return Promise.all(promises).then(() => {
			this.myLocation.startTrackingLocation();
		});
	}
}
