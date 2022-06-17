import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ConnectViewController from './viewController/ConnectViewController';
import {
	alertViewModel,
	ordersViewModel,
	waitersViewModel,
	connectViewModel,
	initViewModels,
} from './context';

if (
	!new (class {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		x: any;
	})().hasOwnProperty('x')
)
	throw new Error('Transpiler is not configured correctly');

console.log('Starting Log');
initViewModels();
ReactDOM.render(
	<React.StrictMode>
		<ConnectViewController
			ordersViewModel={ordersViewModel}
			waitersViewModel={waitersViewModel}
			connectViewModel={connectViewModel}
			alertViewModel={alertViewModel}
		/>
	</React.StrictMode>,
	document.getElementById('root')
);
