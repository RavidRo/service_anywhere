import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import OrdersViewController from './viewController/OrdersViewController';
import OrdersViewModel from './viewModel/ordersViewModel';
import WaitersViewModel from './viewModel/waitersViewModel';
import waitersModel from './model/waiterModel';
import ordersModel from './model/ordersModel';
import ConnectionHandler from './network/connectionHandler';
import Api from './network/api';

const waiterModel = new waitersModel();
const orderModel = new ordersModel();
const api: Api = new Api();
const ordersViewModel = new OrdersViewModel(orderModel, api);
const waitersViewModel = new WaitersViewModel(waiterModel, api);
const connectionHandler = new ConnectionHandler(
	ordersViewModel,
	waitersViewModel
);

console.log('Starting Log');

ReactDOM.render(
	<React.StrictMode>
		<OrdersViewController
			ordersViewModel={ordersViewModel}
			waitersViewModel={waitersViewModel}
		/>
	</React.StrictMode>,
	document.getElementById('root')
);
