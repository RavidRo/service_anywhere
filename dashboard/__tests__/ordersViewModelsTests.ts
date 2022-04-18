import {flushPromises, makePromise as mockMakePromise} from '../PromiseUtils';
import OrderViewModel from '../src/viewModel/ordersViewModel';

import {OrderIDO, WaiterIDO} from '../../api';

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
	(orderId: string, status: string) => Number.parseInt(orderId) % 2 === 0
);
const mockCancelOrder = jest.fn((orderId: string) => true);

jest.mock('../src/network/api', () => {
	return jest.fn().mockImplementation(() => {
		return {
			getOrders: mockGetOrders,
			getWaiters: mockGetWaiters,
			assignWaiter: mockAssignWaiter,
			getWaitersByOrder: mockGetWaitersByOrder,
			changeOrderStatus: mockChangeOrderStatus,
			cancelOrder: mockCancelOrder,
		};
	});
});

import Api from '../src/network/api';
import ordersModel from '../src/model/ordersModel';

beforeEach(() => {
	(Api as unknown as jest.Mock).mockClear();
	mockGetOrders.mockClear();
	mockGetWaiters.mockClear();
});

describe('Constructor', () => {
	test('The class can be created successfully', async () => {
		const ordersViewModel = new OrderViewModel(
			new ordersModel(),
			new Api()
		);
		expect(ordersViewModel).toBeTruthy();
	});

	test('Change order status in server expect false', async () => {
		const ordersViewModel = new OrderViewModel(
			new ordersModel(),
			new Api()
		);
		const ret = ordersViewModel.changeOrderStatus('1', 'in preparation');
		await flushPromises();
		expect(ret).toEqual(false);
	});

	test('Change order status in server epect true', async () => {
		const ordersViewModel = new OrderViewModel(
			new ordersModel(),
			new Api()
		);
		const ret = ordersViewModel.changeOrderStatus('0', 'in preparation');
		await flushPromises();
		expect(ret).toEqual(true);
	});

	test('Set and get orders in model', async () => {
		const model = new ordersModel();
		const ordersViewModel = new OrderViewModel(model, new Api());
		ordersViewModel.orders = mockListOfOrders;
		expect(ordersViewModel.orders).toEqual(model.orders);
	});
});
