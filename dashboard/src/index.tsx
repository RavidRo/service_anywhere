import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ConnectViewController from './viewController/ConnectViewController';
import ConnectViewModel from './viewModel/connectViewModel';
import OrdersViewController from './viewController/OrdersViewController';
import OrdersViewModel from './viewModel/ordersViewModel';
import WaitersViewModel from './viewModel/waitersViewModel';
import waitersModel from './model/waiterModel';
import ordersModel from './model/ordersModel';
import Api from './network/api';

if (
	!new (class {
		x: any;
	})().hasOwnProperty('x')
)
	throw new Error('Transpiler is not configured correctly');

console.log('Starting Log');

const waiterModel = new waitersModel();
const orderModel = new ordersModel();
const api: Api = new Api();

const ordersViewModel = new OrdersViewModel(orderModel, api);
const waitersViewModel = new WaitersViewModel(waiterModel, api);
const connectViewModel = new ConnectViewModel(
	api,
	ordersViewModel,
	waitersViewModel
);

ReactDOM.render(
	<React.StrictMode>
		<ConnectViewController
			ordersViewModel={ordersViewModel}
			waitersViewModel={waitersViewModel}
			connectViewModel={connectViewModel}
		/>
	</React.StrictMode>,
	document.getElementById('root')
);
