import ConnectViewController from './viewController/ConnectViewController';
import ConnectViewModel from './viewModel/connectViewModel';
import OrdersViewModel from './viewModel/ordersViewModel';
import WaitersViewModel from './viewModel/waitersViewModel';
import waitersModel from './model/waiterModel';
import ordersModel from './model/ordersModel';
import Api from './network/api';
import AlertViewModel from './viewModel/alertViewModel';
import AlertModel from './model/alertModel';

export let alertViewModel: AlertViewModel;
export let ordersViewModel: OrdersViewModel;
export let waitersViewModel: WaitersViewModel;
export let connectViewModel: ConnectViewModel;

export const initViewModels = (): void => {
	const waiterModel = new waitersModel();
	const orderModel = new ordersModel();
	const alertModel = new AlertModel();
	const api: Api = new Api();

	alertViewModel = new AlertViewModel(alertModel);
	ordersViewModel = new OrdersViewModel(orderModel, api);
	waitersViewModel = new WaitersViewModel(waiterModel, api);
	connectViewModel = new ConnectViewModel(
		api,
		ordersViewModel,
		waitersViewModel
	);
};
