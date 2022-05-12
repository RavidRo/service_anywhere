import ConnectionHandler from '../Communication/ConnectionHandler';
import ConnectionModel from '../Model/ConnectionModel';
import Requests from '../Networking/requests';
import ItemViewModel from './ItemViewModel';
import OrderViewModel from './OrderViewModel';

export default class ConnectionViewModel {
	private requests: Requests;
	private model: ConnectionModel;
	private connectionHandler: ConnectionHandler;
	private orders: OrderViewModel;
	private items: ItemViewModel;

	constructor(requests: Requests) {
		this.model = ConnectionModel.getInstance();
		this.requests = requests;
		this.connectionHandler = new ConnectionHandler();
		this.orders = new OrderViewModel(requests);
		this.items = new ItemViewModel(requests);
	}

	login(password: string): Promise<string> {
		return this.requests.login(password).then(token => {
			this.model.token = token;
			console.log('token in login after set: ' + this.model.token);
			return token;
		});
	}

	get connection(): ConnectionModel {
		return this.model;
	}

	public connect() {
		const promises = [
			this.orders.getOrderFromServer(),
			this.items.syncItems(),
			new Promise<void>((resolve, reject) => {
				if (this.model.token) {
					this.connectionHandler.connect(this.model.token, () =>
						resolve()
					);
				} else {
					console.log('no token found');
					reject(
						'Tried to connect but an authorization token could not be found'
					);
				}
			}),
		];
		return Promise.all(promises);
	}
}
