import {
	flushPromises,
	makePromise,
	makePromise as mockMakePromise,
} from '../PromiseUtils';
import ConnectViewModel from '../src/viewModel/connectViewModel';

const mockListOfOrders: OrderIDO[] = [
	{
		id: '1',
		items: new Map([
			['a', 2],
			['b', 3],
		]),
		status: 'received',
		guestId: '1',
		creationTime: new Date(),
		terminationTime: new Date(),
	},
	{
		id: '2',
		items: new Map([
			['c', 4],
			['d', 5],
		]),
		status: 'delivered',
		guestId: '2',
		creationTime: new Date(),
		terminationTime: new Date(),
	},
];

const mockListOfWaiters: WaiterIDO[] = [
	{
		id: '1',
		name: 'waiter 1',
		avialabe: false,
	},
	{
		id: '2',
		name: 'waiter 2',
		avialabe: true,
	},
];
const mockGetOrders = jest.fn(() => mockMakePromise(mockListOfOrders));
const mockGetWaiters = jest.fn(() => mockMakePromise(mockListOfWaiters));
const mockAssignWaiter = jest.fn((orderId: string, waiterId: string) => {
	return mockListOfWaiters.filter(waiter => waiter.id === waiterId)[0]
		.avialabe;
});
const mockGetWaitersByOrder = jest.fn((orderId: string) => mockListOfOrders[0]);
const mockChangeOrderStatus = jest.fn(
	(orderId: string, status: string) => false
);
const mockCancelOrder = jest.fn((orderId: string) => true);
const mockLogin = jest.fn((password: string) => makePromise('token'));

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
		};
	});
});

const mockConnect = jest.fn(
	(token: string, onSuccess?: () => void, onError?: () => void) =>
		onSuccess?.()
);

jest.mock('../src/network/connectionHandler', () => {
	return jest.fn().mockImplementation(() => {
		return {connect: mockConnect};
	});
});
import Api from '../src/network/api';
import OrdersViewModel from '../src/viewModel/ordersViewModel';
import WaitersViewModel from '../src/viewModel/waitersViewModel';
import ordersModel from '../src/model/ordersModel';
import waiterModel from '../src/model/waiterModel';
import {OrderIDO, WaiterIDO} from '../../api';
import ConnectionHandler from '../src/network/connectionHandler';

beforeEach(() => {
	(Api as unknown as jest.Mock).mockClear();
	(ConnectionHandler as unknown as jest.Mock).mockClear();

	// (OrdersViewModel as unknown as jest.Mock).mockClear();
	// (WaitersViewModel as unknown as jest.Mock).mockClear();
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
		ret.then(token => expect(token !== undefined));
	});

	test('Login in server receive undefined', async () => {
		mockLogin.mockImplementation(password => makePromise(undefined));
		const connectViewModel = getViewModel();
		const ret = connectViewModel.login('password');
		ret.then(token => expect(token === undefined));
	});

	test('connect websockets with token', async () => {
		mockLogin.mockImplementation((password: string) =>
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
	});

	test('connect websockets without token', async () => {
		mockLogin.mockImplementation((password: string) =>
			makePromise(undefined)
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
		viewModel.connect().catch(r => expect(r).toBeTruthy());
	});

	test('connect websockets with token and expect reject', async () => {
		mockLogin.mockImplementation((password: string) => makePromise('asd'));
		mockConnect.mockImplementation(
			(token: string, onSuccess?: () => void, onError?: () => void) =>
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
		viewModel.connect().catch(r => expect(r).toBeTruthy());
	});
});
