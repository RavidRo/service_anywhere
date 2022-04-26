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

	const logIn = (password: string) => {
		setIsLoading(true);
		return connectionViewModel
			.login(password)
			.finally(() => setIsLoading(false));
	};

	const onSubmit = (password: string) => {
		logIn(password)
			.then(establishConnection)
			.catch(e => {
				const msg = e?.response?.data ?? "Can't login to server";
				Alert.alert(msg);
			});
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
