import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {Alert} from 'react-native';
import {ConnectionContext} from '../contexts';
import ConnectView from '../View/ConnectView';

type LoginControllerProps = {};

const ConnectController = observer((_props: LoginControllerProps) => {
	const connection = useContext(ConnectionContext);

	const token = connection.token;
	const isLoggedIn = token !== undefined;

	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [phone_number, setPhoneNumber] = useState('');

	const establishConnection = () => {
		setIsLoading(true);
		connection
			.connect()
			.then(() => setIsConnected(true))
			.catch(() => Alert.alert("Can't establish connection to server"))
			.finally(() => setIsLoading(false));
	};

	const logIn = () => {
		setIsLoading(true);
		return connection
			.login(phone_number)
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
			phone_number={phone_number}
			onPhoneNumberChange={setPhoneNumber}
			onSubmit={onSubmit}
			establishConnection={establishConnection}
			isReconnecting={connection.isReconnecting}
		/>
	);
});
export default ConnectController;
