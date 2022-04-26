import ConnectModel from '../model/ConnectModel';
import Api from '../network/api';
import ConnectionHandler from '../network/connectionHandler';
import OrdersView from '../view/OrdersView';
import OrdersViewModel from './ordersViewModel';
import WaitersViewModel from './waitersViewModel';

export default class ConnectViewModel {
	private api: Api;
	private model: ConnectModel;
	private connectionHandler: ConnectionHandler;
	private waitersViewModel: WaitersViewModel;
	private ordersViewModel: OrdersViewModel;

	constructor(
		api: Api,
		orderViewModel: OrdersViewModel,
		waiterViewModel: WaitersViewModel
	) {
		this.api = api;
		this.model = ConnectModel.getInstance();
		this.ordersViewModel = orderViewModel;
		this.waitersViewModel = waiterViewModel;

		this.connectionHandler = new ConnectionHandler(
			orderViewModel,
			waiterViewModel
		);
	}

	login(password: string): Promise<string> {
		return this.api.login(password).then(token => {
			this.model.token = token;
			return token;
		});
	}

	get connection(): ConnectModel {
		return this.model;
	}

	public connect() {
		return new Promise<void>((resolve, reject) => {
			if (this.model.token !== undefined) {
				console.info('Trying to connect with token ', this.model.token);
				this.waitersViewModel.synchroniseWaiters();
				this.ordersViewModel.synchroniseOrders();
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
		});
	}
}
