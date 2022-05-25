import {
	flushPromises,
	makePromise,
	makePromise as mockMakePromise,
} from '../PromiseUtils';
import ConnectViewModel from '../src/viewModel/connectViewModel';
import Api from '../src/network/api';
import OrdersViewModel from '../src/viewModel/ordersViewModel';
import WaitersViewModel from '../src/viewModel/waitersViewModel';
import ordersModel from '../src/model/ordersModel';
import waiterModel from '../src/model/waiterModel';
import {OrderIDO, WaiterIDO} from '../../api';
import ConnectionHandler from '../src/network/connectionHandler';

const mockListOfOrders: OrderIDO[] = [
	{
		id: '1',
		items: {
			a: 2,
			b: 3,
		},
		status: 'received',
		guestId: '1',
		creationTime: new Date(),
		completionTime: new Date(),
	},
	{
		id: '2',
		items: {
			c: 4,
			d: 5,
		},
		status: 'delivered',
		guestId: '2',
		creationTime: new Date(),
		completionTime: new Date(),
	},
];

const mockListOfWaiters: WaiterIDO[] = [
	{
		id: '1',
		name: 'waiter 1',
		available: false,
	},
	{
		id: '2',
		name: 'waiter 2',
		available: true,
	},
];
const mockGetOrders = jest.fn(() => mockMakePromise(mockListOfOrders));
const mockGetWaiters = jest.fn(() => mockMakePromise(mockListOfWaiters));
const mockAssignWaiter = jest.fn((_orderId: string, waiterId: string) => {
	return mockListOfWaiters.filter(waiter => waiter.id === waiterId)[0]
		.available;
});
const mockGetWaitersByOrder = jest.fn((_orderId: string) =>
	Promise.resolve(mockListOfOrders[0])
);
const mockChangeOrderStatus = jest.fn(
	(_orderId: string, _status: string) => false
);
const mockCancelOrder = jest.fn((_orderId: string) => true);
const mockLogin = jest.fn((_password: string) => makePromise('token'));
const mockGetItems = jest.fn(() => makePromise([]));

jest.mock('../src/network/api', () => {
	return jest.fn().mockImplementation(() => {
		return {
			getOrders: mockGetOrders,
			getWaiters: mockGetWaiters,
			assignWaiter: mockAssignWaiter,
			getWaitersByOrder: mockGetWaitersByOrder,
			changeOrderStatus: mockChangeOrderStatus,
			cancelOrder: mockCancelOrder,
			login: mockLogin,
			getItems: mockGetItems,
		};
	});
});

const mockConnect = jest.fn(
	(_token: string, onSuccess?: () => void, _onError?: () => void) =>
		onSuccess?.()
);

jest.mock('../src/network/connectionHandler', () => {
	return jest.fn().mockImplementation(() => {
		return {connect: mockConnect};
	});
});

beforeEach(() => {
	(Api as unknown as jest.Mock).mockClear();
	(ConnectionHandler as unknown as jest.Mock).mockClear();

	jest.spyOn(console, 'info').mockImplementation(jest.fn());
	jest.spyOn(console, 'log').mockImplementation(jest.fn());
	jest.spyOn(console, 'warn').mockImplementation(jest.fn());
});

const getViewModel = (): ConnectViewModel => {
	const api = new Api();
	return new ConnectViewModel(
		api,
		new OrdersViewModel(new ordersModel(), api),
		new WaitersViewModel(new waiterModel(), api)
	);
};

describe('Constructor', () => {
	test('The class can be created successfully', async () => {
		const connectViewModel = getViewModel();
		expect(connectViewModel).toBeTruthy();
	});

	test('Login in server receive token', async () => {
		const connectViewModel = getViewModel();
		const ret = connectViewModel.login('password');
		return ret.then(token => expect(token !== undefined));
	});

	test('connect websockets with token', async () => {
		mockLogin.mockImplementation((_password: string) =>
			makePromise('token')
		);

		const api = new Api();
		const orderViewModel = new OrdersViewModel(new ordersModel(), api);
		const waitersViewModel = new WaitersViewModel(new waiterModel(), api);
		const viewModel = new ConnectViewModel(
			api,
			orderViewModel,
			waitersViewModel
		);
		viewModel.login('Asd');
		await flushPromises();
		viewModel.connect();
		await flushPromises();
		expect(mockGetOrders).toHaveBeenCalled();
		expect(mockGetWaiters).toHaveBeenCalled();
		expect(mockGetItems).toHaveBeenCalled();
		expect(mockGetWaitersByOrder).toHaveBeenCalled();
	});

	test('connect websockets without token', async () => {
		mockLogin.mockImplementation((_password: string) => makePromise(''));

		const api = new Api();
		const orderViewModel = new OrdersViewModel(new ordersModel(), api);
		const waitersViewModel = new WaitersViewModel(new waiterModel(), api);
		const viewModel = new ConnectViewModel(
			api,
			orderViewModel,
			waitersViewModel
		);
		viewModel.login('Asd');
		await flushPromises();
		return viewModel.connect().catch(r => expect(r).toBeTruthy());
	});

	test('connect websockets with token and expect reject', async () => {
		mockLogin.mockImplementation((_password: string) => makePromise('asd'));
		mockConnect.mockImplementation(
			(_token: string, _onSuccess?: () => void, onError?: () => void) =>
				onError?.()
		);
		const api = new Api();
		const orderViewModel = new OrdersViewModel(new ordersModel(), api);
		const waitersViewModel = new WaitersViewModel(new waiterModel(), api);
		const viewModel = new ConnectViewModel(
			api,
			orderViewModel,
			waitersViewModel
		);
		viewModel.login('Asd');
		await flushPromises();
		return viewModel.connect().catch(r => expect(r).toBeTruthy());
	});
});
