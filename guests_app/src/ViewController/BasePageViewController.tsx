import React from 'react';
import {BasePage} from '../View/BaseView';

export const BasePageViewController = () => {
	const Props = {
		connected: false,
	};

	return <BasePage {...Props} />;
};
