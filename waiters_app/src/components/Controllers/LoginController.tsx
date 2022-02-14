import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import {IDContext} from 'waiters_app/src/contexts';
import {useAPI} from 'waiters_app/src/hooks/useApi';
import Requests from 'waiters_app/src/networking/requests';
import LoginView from '../Views/LoginView';

type LoginControllerProps = {};

export default function LoginController(_props: LoginControllerProps) {
	const requests = new Requests();
	const {request, data} = useAPI(requests.login);
	useEffect(() => {
		request().catch(() => Alert.alert("Can't connect to server :("));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<IDContext.Provider value={data}>
			<LoginView connected={data !== undefined} />
		</IDContext.Provider>
	);
}
