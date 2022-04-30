import {observer} from '../../node_modules/mobx-react-lite';
import React, {useContext, useState} from 'react';
import {Alert} from 'react-native';
import {ConnectionContext} from '../contexts';
import ConnectView from '../View/ConnectView';

type LoginControllerProps = {};

const ConnectController = observer((_props: LoginControllerProps) => {
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
			.catch(() => Alert.alert("Can't establish connection to server"));
	};

	const logIn = (password: string) => {
		return connectionViewModel
			.login(password)
	};

	const onSubmit = () => {
		logIn(password)
			.then(establishConnection)
			.catch(e => {
				const msg = e?.response?.data ?? "Can't login to server";
				Alert.alert(msg);
			})
			.finally(() => setIsLoading(false));
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