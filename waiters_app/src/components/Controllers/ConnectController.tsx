import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import ConnectionHandler from 'waiters_app/src/communication/ConnectionHandlers';
import {useAPI} from 'waiters_app/src/hooks/useApi';
import Requests from 'waiters_app/src/networking/Requests';
import AuthenticateViewModel from 'waiters_app/src/ViewModel/AuthenticateViewModel';
import OrdersViewModel from 'waiters_app/src/ViewModel/OrdersViewModel';
import ConnectView from '../Views/ConnectView';

type LoginControllerProps = {};

const authentication = new AuthenticateViewModel(new Requests());
const orders = new OrdersViewModel(new Requests());
const connection = new ConnectionHandler();

export default function ConnectController(_props: LoginControllerProps) {
	const id = authentication.id;
	const {request} = useAPI(authentication.login);
	useEffect(() => {
		request()
			.then(id => {
				orders.synchronizeOrders(id);
			})
			.catch(() => Alert.alert("Can't connect to server :("));
		connection.connect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {}, []);
	return <ConnectView connected={id !== undefined} />;
}
