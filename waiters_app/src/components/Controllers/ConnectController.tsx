import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {Alert} from 'react-native';
import {
	ConnectionContext,
	itemsContext,
	OrdersContext,
} from 'waiters_app/src/contexts';

import ConnectView from '../Views/ConnectView';

type LoginControllerProps = {};

const ConnectController = observer((_props: LoginControllerProps) => {
	const connection = useContext(ConnectionContext);
	const orders = useContext(OrdersContext);
	const items = useContext(itemsContext);

	const token = connection.token;
	const isLoggedIn = token !== undefined;

	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [password, setPassword] = useState('');

	const establishConnection = () => {
		const promises = [
			orders.synchronizeOrders(),
			items.syncItems(),
			new Promise<void>(resolve => connection.connect(() => resolve())),
		];
		setIsLoading(true);
		Promise.all(promises)
			.then(() => {
				setIsConnected(true);
			})
			.catch(() => {
				Alert.alert("Can't establish connection to server");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const onSubmit = () => {
		setIsLoading(true);
		connection
			.login()
			.catch(() => Alert.alert("Can't login to server"))
			.finally(() => setIsLoading(false))
			.then(establishConnection);
	};

	return (
		<ConnectView
			loggedIn={isLoggedIn}
			isLoading={isLoading}
			isConnected={isConnected}
			password={password}
			onPasswordChange={setPassword}
			onSubmit={onSubmit}
			establishConnection={establishConnection}
			isReconnecting={connection.isReconnecting}
		/>
	);
});
export default ConnectController;
