import ConnectViewController from './viewController/ConnectViewController';
import ConnectViewModel from './viewModel/connectViewModel';
import OrdersViewModel from './viewModel/ordersViewModel';
import WaitersViewModel from './viewModel/waitersViewModel';
import waitersModel from './model/waiterModel';
import ordersModel from './model/ordersModel';
import Api from './network/api';
import AlertViewModel from './viewModel/alertViewModel';
import AlertModel from './model/alertModel';

const waiterModel = new waitersModel();
const orderModel = new ordersModel();
const alertModel = new AlertModel();
const api: Api = new Api();

export const alertViewModel = new AlertViewModel(alertModel);
export const ordersViewModel = new OrdersViewModel(orderModel, api);
export const waitersViewModel = new WaitersViewModel(waiterModel, api);
export const connectViewModel = new ConnectViewModel(
	api,
	ordersViewModel,
	waitersViewModel
);
