import ConnectionHandler from '../communication/ConnectionHandler';
import ConnectionModel from '../Models/ConnectionModel';
import Requests from '../networking/Requests';
import {ItemViewModel} from './ItemViewModel';
import MyLocationViewModel from './MyLocationViewModel';
import OrderViewModel from './OrderViewModel';

export default class ConnectionViewModel {
	private requests: Requests;
	private model: ConnectionModel;
	private connectionHandler: ConnectionHandler;
	private orders: OrderViewModel;
	private items: ItemViewModel;
	private myLocation: MyLocationViewModel;

	constructor(
		requests: Requests,
		orderViewModel: OrderViewModel,
		itemViewModel: ItemViewModel,
		myLocationViewModel: MyLocationViewModel
	) {
		this.model = ConnectionModel.getInstance();
		this.connectionHandler = new ConnectionHandler(requests, itemViewModel);
		this.requests = requests;
		this.orders = orderViewModel;
		this.items = itemViewModel;
		this.myLocation = myLocationViewModel;
	}

	login(password: string): Promise<string> {
		return this.requests.login(password).then(token => {
			console.info('Logged in with token:', token);
			this.model.token = token;
			return token;
		});
	}

	get connection(): ConnectionModel {
		return this.model;
	}

	public connect() {
		const promises = [
			this.orders.synchronizeOrders(),
			this.items.syncItems(),
			new Promise<void>((resolve, reject) => {
				if (this.model.token) {
					this.connectionHandler.connect(
						this.model.token,
						() => resolve(),
						() =>
							reject(
								'Could not connect to server, please try again later'
							)
					);
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
