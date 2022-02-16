import React, {useContext, useEffect} from 'react';
import {Alert} from 'react-native';
import ConnectionHandler from 'waiters_app/src/communication/ConnectionHandlers';
import {
	AuthenticationContext,
	itemsContext,
	OrdersContext,
} from 'waiters_app/src/contexts';
import {useAPI} from 'waiters_app/src/hooks/useApi';

import ConnectView from '../Views/ConnectView';

type LoginControllerProps = {};

const connection = new ConnectionHandler();

export default function ConnectController(_props: LoginControllerProps) {
	const authentication = useContext(AuthenticationContext);
	const orders = useContext(OrdersContext);
	const items = useContext(itemsContext);

	const id = authentication.id;
	const {request} = useAPI(authentication.login);
	useEffect(() => {
		request()
			.then(id => {
				const promises = [
					orders.synchronizeOrders(id),
					items.syncItems(),
				];
				// TODO: Add reconnect button and then
				Promise.all(promises).catch(() =>
					Alert.alert("Can't get data from server :(")
				);
			})
			.catch(() => Alert.alert("Can't connect to server :("));
		connection.connect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {}, []);
	return <ConnectView connected={id !== undefined} />;
}
