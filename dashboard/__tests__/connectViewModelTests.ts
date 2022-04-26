import {flushPromises, makePromise as mockMakePromise} from '../PromiseUtils';
import ConnectViewModel from '../src/viewModel/connectViewModel';

const mockGetOrders = jest.fn();
const mockGetWaiters = jest.fn();
const mockAssignWaiter = jest.fn();
const mockGetWaitersByOrder = jest.fn();
const mockChangeOrderStatus = jest.fn(
	(orderId: string, status: string) => false
);
const mockCancelOrder = jest.fn((orderId: string) => true);
const mockLogin = jest.fn((password: string) => true);

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

// jest.mock('../src/viewModel/ordersViewModel', () => {
// 	return jest.fn().mockImplementation(() => {
// 		return {
// 			changeOrderStatus: jest.fn(),
// 		};
// 	});
// });

// jest.mock('../src/viewModel/waitersViewModel', () => {
// 	return jest.fn().mockImplementation(() => {
// 		return {
// 			assignWaiter: jest.fn(),
// 			getWaitersByOrder: jest.fn(),
// 		};
// 	});
// });

import Api from '../src/network/api';
import OrdersViewModel from '../src/viewModel/ordersViewModel';
import WaitersViewModel from '../src/viewModel/waitersViewModel';
import ordersModel from '../src/model/ordersModel';
import waiterModel from '../src/model/waiterModel';

beforeEach(() => {
	(Api as unknown as jest.Mock).mockClear();
	// (OrdersViewModel as unknown as jest.Mock).mockClear();
	// (WaitersViewModel as unknown as jest.Mock).mockClear();
});
const orders = new OrdersViewModel(new ordersModel(), new Api());

const waiters = new WaitersViewModel(new waiterModel(), new Api());

describe('Constructor', () => {
	test('The class can be created successfully', async () => {
		const loginViewModel = new ConnectViewModel(new Api(), orders, waiters);
		expect(loginViewModel).toBeTruthy();
	});

	test('Login in server expect true', async () => {
		const loginViewModel = new ConnectViewModel(new Api(), orders, waiters);
		const ret = loginViewModel.login('password');
		await flushPromises();
		expect(ret).toEqual(true);
	});

	test('Login in server epect false', async () => {
		mockLogin.mockImplementation(() => false);
		const loginViewModel = new ConnectViewModel(new Api(), orders, waiters);
		const ret = loginViewModel.login('password');
		await flushPromises();
		expect(ret).toEqual(false);
	});
});
