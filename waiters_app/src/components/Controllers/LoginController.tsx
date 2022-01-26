import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import {IDContext} from 'waiters_app/src/contexts';
import {useAPI} from 'waiters_app/src/hooks/useApi';
import AuthenticateViewModel from 'waiters_app/src/ViewModel/AuthenticateViewMode';
import LoginView from '../Views/LoginView';

type LoginControllerProps = {};

export default function LoginController(_props: LoginControllerProps) {
	const authentication = new AuthenticateViewModel();
	const {request, data: id} = useAPI(authentication.login);
	useEffect(() => {
		request().catch(() => Alert.alert("Can't connect to server :("));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<IDContext.Provider value={id}>
			<LoginView connected={id !== undefined} />
		</IDContext.Provider>
	);
}
