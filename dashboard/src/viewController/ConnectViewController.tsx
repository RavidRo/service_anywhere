import React from 'react';
import {useState} from 'react';
import Login from '../view/loginView';
import ConnectViewModel from '../viewModel/connectViewModel';
import OrdersViewController from '../viewController/OrdersViewController';
import OrdersViewModel from '../viewModel/ordersViewModel';
import WaitersViewModel from '../viewModel/waitersViewModel';
import Button from '@mui/material/Button';
import {observer} from 'mobx-react';

interface Props {
	ordersViewModel: OrdersViewModel;
	waitersViewModel: WaitersViewModel;
	connectViewModel: ConnectViewModel;
}

const ConnectViewController = (props: Props) => {
	const {ordersViewModel, waitersViewModel, connectViewModel} = props;

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

	const login = (name: string, password: string) => {
		return connectViewModel
			.login(name, password)
			.finally(() => setIsLoading(false));
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const name: string = data.get('name')?.toString() || '';
		const password: string = data.get('password')?.toString() || '';
		login(name, password)
			.then(establishConnection)
			.catch(() => alert("Can't login to server"));
	};

	if (isConnected) {
		return (
			<>
				{console.info('opening orders View Controller')}
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
};

export default observer(ConnectViewController);
