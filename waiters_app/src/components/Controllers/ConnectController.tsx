import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {Alert} from 'react-native';
import {ConnectionContext} from 'waiters_app/src/contexts';

import ConnectView from '../Views/ConnectView';

type ConnectControllerProps = {};

const ConnectController = observer((_props: ConnectControllerProps) => {
	const connectionViewModel = useContext(ConnectionContext);

	const token = connectionViewModel.connection.token;
	const isLoggedIn = token !== undefined;

	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [password, setPassword] = useState('');

	const establishConnection = () => {
		setIsLoading(true);
		connectionViewModel
			.connect()
			.then(() => setIsConnected(true))
			.catch(() => Alert.alert("Can't establish connection to server"))
			.finally(() => setIsLoading(false));
	};

	const logIn = () => {
		setIsLoading(true);
		return connectionViewModel
			.login()
			.catch(() => Alert.alert("Can't login to server"))
			.finally(() => setIsLoading(false));
	};

	const onSubmit = () => {
		logIn().then(establishConnection);
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
			isReconnecting={connectionViewModel.connection.isReconnecting}
		/>
	);
});
export default ConnectController;
