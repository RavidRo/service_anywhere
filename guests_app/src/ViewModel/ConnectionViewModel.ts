import ConnectionHandler from '../Communication/ConnectionHandler';
import ConnectionModel from '../Model/ConnectionModel';
import Requests from '../Networking/requests';
import ItemViewModel from './ItemViewModel';
import OrderViewModel from './OrderViewModel';

export default class ConnectionViewModel {
	private requests: Requests;
	private model: ConnectionModel;
	private connection: ConnectionHandler;
	private orders: OrderViewModel;
	private items: ItemViewModel;

	constructor(requests: Requests) {
		this.model = ConnectionModel.getInstance();
		this.requests = requests;
		this.connection = new ConnectionHandler();
		this.orders = new OrderViewModel(requests);
		this.items = new ItemViewModel(requests);
	}

	login(phone_number: string): Promise<string> {
		return this.requests.login(phone_number).then(token => {
			this.requests.setToken(token);
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
			this.orders.getOrderFromServer(),
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

		return Promise.all(promises);
	}
}
