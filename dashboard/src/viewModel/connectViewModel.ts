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
		const token = this.model.token;

		if (token !== undefined) {
			console.info('Trying to connect with token ', this.model.token);
			return Promise.all([
				this.waitersViewModel.synchroniseWaiters(),
				this.ordersViewModel.synchroniseOrders(),
				this.ordersViewModel.synchroniseItems(),
				new Promise<void>((resolve, reject) => {
					this.connectionHandler.connect(
						token,
						() => resolve(),
						() =>
							reject(
								'Could not connect to server, please try again later'
							)
					);
				}),
			])
				.then(() => console.info('Finished synchrosing and connecting'))
				.catch(() => alert('Error in synchronisation or connecting'));
		} else {
			return new Promise<void>((_, reject) => {
				reject(
					'Tried to connect but an authorization token could not be found'
				);
			});
		}
	}
}
