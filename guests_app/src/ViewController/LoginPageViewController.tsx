import React from 'react';
import Requests from '../Networking/requests';
import AuthenticateViewModel from '../ViewModel/AuthenticateViewModel';
import {LoginPage} from '../View/LoginPageView';

export const LoginPageViewController = () => {
	const requests = new Requests();
	const authenticateViewModel = new AuthenticateViewModel(requests);
	// need to change page to Main page when login succeed
	// passing the token recevied from server

	const Props = {
		Login: authenticateViewModel.login,
	};

	return <LoginPage {...Props} />;
};
