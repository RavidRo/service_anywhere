import {useState} from 'react';
import Login from '../view/loginView';
import ConnectViewModel from '../viewModel/connectViewModel';
import OrdersViewController from '../viewController/OrdersViewController';
import OrdersViewModel from '../viewModel/ordersViewModel';
import WaitersViewModel from '../viewModel/waitersViewModel';
import waitersModel from '../model/waiterModel';
import ordersModel from '../model/ordersModel';
import ConnectionHandler from '../network/connectionHandler';
import Api from '../network/api';
import Button from '@mui/material/Button';

export default function ConnectViewController() {
	const waiterModel = new waitersModel();
	const orderModel = new ordersModel();
	const api: Api = new Api();

	const ordersViewModel = new OrdersViewModel(orderModel, api);
	const waitersViewModel = new WaitersViewModel(waiterModel, api);
	const connectViewModel = new ConnectViewModel(
		api,
		ordersViewModel,
		waitersViewModel
	);

	const token = connectViewModel.connection.token;
	const isLoggedIn = token !== undefined;

	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const establishConnection = () => {
		connectViewModel
			.connect()
			.then(() => setIsConnected(true))
			.catch(() => alert("Can't establish connection to server"))
			.finally(() => setIsLoading(false));
	};

	const login = (password: string) => {
		return connectViewModel
			.login(password)
			.finally(() => setIsLoading(false));
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const password: string = data.get('password')?.toString() || '';
		login(password)
			.then(establishConnection)
			.catch(() => alert("Can't login to server"));
	};

	if (isConnected) {
		return (
			<>
				{connectViewModel.connection.isReconnecting &&
					alert('Connection lost, trying to reconnect...')}
				<OrdersViewController
					ordersViewModel={ordersViewModel}
					waitersViewModel={waitersViewModel}
				/>
			</>
		);
	}
	if (isLoggedIn) {
		return (
			<>
				{isLoading ? (
					alert('Establishing connection...')
				) : (
					<Button onClick={establishConnection} disabled={isLoading}>
						Retry
					</Button>
				)}
			</>
		);
	}

	return <Login handleSubmit={handleSubmit} />;
}
