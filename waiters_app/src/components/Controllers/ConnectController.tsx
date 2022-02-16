import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import ConnectionHandler from 'waiters_app/src/communication/ConnectionHandlers';
import {useAPI} from 'waiters_app/src/hooks/useApi';
import Requests from 'waiters_app/src/networking/Requests';
import AuthenticateViewModel from 'waiters_app/src/ViewModel/AuthenticateViewModel';
import {ItemsViewModel} from 'waiters_app/src/ViewModel/ItemsViewModel';
import OrdersViewModel from 'waiters_app/src/ViewModel/OrdersViewModel';
import ConnectView from '../Views/ConnectView';

type LoginControllerProps = {};

const requests = new Requests();
const authentication = new AuthenticateViewModel(requests);
const orders = new OrdersViewModel(requests);
const items = new ItemsViewModel(requests);
const connection = new ConnectionHandler();

export default function ConnectController(_props: LoginControllerProps) {
	const id = authentication.id;
	const {request} = useAPI(authentication.login);
	useEffect(() => {
		request()
			.then(id => {
				orders.synchronizeOrders(id);
				items.syncItems();
			})
			.catch(() => Alert.alert("Can't connect to server :("));
		connection.connect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {}, []);
	return <ConnectView connected={id !== undefined} />;
}
