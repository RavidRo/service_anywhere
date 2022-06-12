import React from 'react';
import {useState} from 'react';
import Login from '../view/loginView';
import ConnectViewModel from '../viewModel/connectViewModel';
import OrdersViewController from '../viewController/OrdersViewController';
import OrdersViewModel from '../viewModel/ordersViewModel';
import WaitersViewModel from '../viewModel/waitersViewModel';
import Button from '@mui/material/Button';
import {observer} from 'mobx-react';
import AlertViewModel from '../viewModel/alertViewModel';

interface Props {
	ordersViewModel: OrdersViewModel;
	waitersViewModel: WaitersViewModel;
	connectViewModel: ConnectViewModel;
	alertViewModel: AlertViewModel;
}

const ConnectViewController = (props: Props) => {
	const {
		ordersViewModel,
		waitersViewModel,
		connectViewModel,
		alertViewModel,
	} = props;

	const token = connectViewModel.connection.token;
	const isLoggedIn = token !== undefined;

	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const establishConnection = () => {
		connectViewModel
			.connect()
			.then(() => setIsConnected(true))
			.catch(() =>
				alertViewModel.addAlert("Can't establish connection to server")
			)
			.finally(() => setIsLoading(false));
	};

	const login = (username: string, password: string) => {
		return connectViewModel
			.login(username, password)
			.finally(() => setIsLoading(false));
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const username: string = data.get('username')?.toString() || '';
		const password: string = data.get('password')?.toString() || '';
		login(username, password)
			.then(establishConnection)
			.catch(() => alertViewModel.addAlert("Can't login to server"));
	};

	if (isConnected) {
		return (
			<>
				{console.info('opening orders View Controller')}
				{connectViewModel.connection.isReconnecting &&
					alertViewModel.addAlert(
						'Connection lost, trying to reconnect...'
					)}
				<OrdersViewController
					ordersViewModel={ordersViewModel}
					waitersViewModel={waitersViewModel}
					alertViewModel={alertViewModel}
				/>
			</>
		);
	}
	if (isLoggedIn) {
		return (
			<>
				{isLoading ? (
					alertViewModel.addAlert('Establishing connection...')
				) : (
					<Button onClick={establishConnection} disabled={isLoading}>
						Retry
					</Button>
				)}
			</>
		);
	}

	return <Login handleSubmit={handleSubmit} />;
};

export default observer(ConnectViewController);
