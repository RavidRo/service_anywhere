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
		guestID: '1',
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
		guestID: '2',
		creationTime: new Date(),
		completionTime: new Date(),
	},
];

const mockListOfWaiters: WaiterIDO[] = [
	{
		id: '1',
		username: 'waiter 1',
	},
	{
		id: '2',
		username: 'waiter 2',
	},
];
const mockGetOrders = jest.fn(() => mockMakePromise(mockListOfOrders));
const mockGetWaiters = jest.fn(() => mockMakePromise(mockListOfWaiters));
const mockAssignWaiter = jest.fn((_orderId: string, _: string) => {
	return true;
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

var api;
var orderModel;
var ordersViewModel;
var waitersModel;
var waitersViewModel;
var connectViewModel;

beforeEach(() => {
	api = new Api();
	orderModel = new ordersModel();
	ordersViewModel = new OrdersViewModel(
		orderModel, api
	);
	waitersModel = new waiterModel();
	waitersViewModel = new WaitersViewModel(waitersModel, api);
	connectViewModel = new ConnectViewModel(
		api,
		ordersViewModel,
		waitersViewModel
	);
	(Api as unknown as jest.Mock).mockClear();
	(ConnectionHandler as unknown as jest.Mock).mockClear();

	jest.spyOn(console, 'info').mockImplementation(jest.fn());
	jest.spyOn(console, 'log').mockImplementation(jest.fn());
	jest.spyOn(console, 'warn').mockImplementation(jest.fn());
});

describe('Constructor', () => {
	test('The class can be created successfully', async () => {
		expect(connectViewModel).toBeTruthy();
	});

	test('Login in server receive token', async () => {
		const ret = connectViewModel.login('', 'password');
		return ret.then(token => expect(token !== undefined));
	});

	test('connect websockets with token', async () => {
		mockLogin.mockImplementation((_password: string) =>
			makePromise('token')
		);

		connectViewModel.login('Asd', 'Asd');
		await flushPromises();
		connectViewModel.connect();
		await flushPromises();
		expect(mockGetOrders).toHaveBeenCalled();
		expect(mockGetWaiters).toHaveBeenCalled();
		expect(mockGetItems).toHaveBeenCalled();
		expect(mockGetWaitersByOrder).toHaveBeenCalled();
	});

	test('connect websockets without token', async () => {
		mockLogin.mockImplementation((_password: string) => makePromise(''));

		connectViewModel.login('asd', 'Asd');
		await flushPromises();
		return connectViewModel.connect().catch(r => expect(r).toBeTruthy());
	});

	test('connect websockets with token and expect reject', async () => {
		mockLogin.mockImplementation((_password: string) => makePromise('asd'));
		mockConnect.mockImplementation(
			(_token: string, _onSuccess?: () => void, onError?: () => void) =>
				onError?.()
		);
		connectViewModel.login('asd', 'Asd');
		await flushPromises();
		return connectViewModel.connect().catch(r => expect(r).toBeTruthy());
	});
});
