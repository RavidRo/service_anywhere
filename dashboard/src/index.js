import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import OrdersViewController from './viewController/OrdersViewController';
import OrdersViewModel from './viewModel/ordersViewModel';
import WaitersViewModel from './viewModel/waitersViewModel';
import waitersModel from './model/waiterModel';
import ordersModel from './model/ordersModel';

const waiterModel = new waitersModel();
const orderModel = new ordersModel();
const ordersViewModel = new OrdersViewModel(orderModel);
const waitersViewModel = new WaitersViewModel(waiterModel);

ReactDOM.render(
	<React.StrictMode>
		<OrdersViewController
			ordersViewModel={ordersViewModel}
			waitersViewModel={waitersViewModel}
		/>
	</React.StrictMode>,
	document.getElementById('root')
);
