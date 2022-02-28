import {observer} from 'mobx-react-lite';
import React, {useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import ConnectionHandler from 'waiters_app/src/communication/ConnectionHandler';
import {
	AuthenticationContext,
	itemsContext,
	OrdersContext,
} from 'waiters_app/src/contexts';
import {useAPI} from 'waiters_app/src/hooks/useApi';

import ConnectView from '../Views/ConnectView';

type LoginControllerProps = {};

const connection = new ConnectionHandler();

const ConnectController = observer((_props: LoginControllerProps) => {
	const authentication = useContext(AuthenticationContext);
	const orders = useContext(OrdersContext);
	const items = useContext(itemsContext);

	const [connected, setConnected] = useState(false);

	const token = authentication.token;

	useEffect(() => {
		if (token) {
			const promises = [
				orders.synchronizeOrders(token),
				items.syncItems(),
				new Promise<void>(resolve =>
					connection.connect(token, () => resolve())
				),
			];
			// TODO: Add reconnect button
			Promise.all(promises)
				.then(() => setConnected(true))
				.catch(() => Alert.alert("Can't connect to server"));
		} else {
			authentication
				.login()
				.catch(() => Alert.alert("Can't login to server"));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);
	return <ConnectView connected={connected} />;
});
export default ConnectController;
