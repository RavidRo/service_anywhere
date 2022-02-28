import React, {useState} from 'react';
import Requests from '../Networking/requests';
import {BasePage} from '../View/BaseView';

export const BasePageViewController = () => {
	const requests = new Requests();

	const Props = {
		connected: false,
	};

	return <BasePage {...Props} />;
};
