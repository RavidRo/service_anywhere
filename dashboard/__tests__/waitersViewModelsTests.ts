import {flushPromises, makePromise as mockMakePromise} from '../PromiseUtils';
import WaitersViewModel from '../src/viewModel/waitersViewModel';

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
	(orderId: string, status: string) => true
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
import waiterModel from '../src/model/waiterModel';

beforeEach(() => {
	(Api as unknown as jest.Mock).mockClear();
	mockGetOrders.mockClear();
	mockGetWaiters.mockClear();
});

describe('Constructor', () => {
	test('The class can be created successfully', async () => {
		const waiterViewModel = new WaitersViewModel(
			new waiterModel(),
			new Api()
		);
		expect(waiterViewModel).toBeTruthy();
	});

	test('call assign waiter in server', async () => {
		const waiterViewModel = new WaitersViewModel(
			new waiterModel(),
			new Api()
		);
		waiterViewModel.assignWaiter('1', '1');
		expect(mockAssignWaiter).toHaveBeenCalled();
	});

	test('call get waiters by order in server', async () => {
		const waiterViewModel = new WaitersViewModel(
			new waiterModel(),
			new Api()
		);
		waiterViewModel.getWaitersByOrder('1');
		expect(mockGetWaitersByOrder).toHaveBeenCalled();
	});

	test('Set and get orders in model', async () => {
		const model = new waiterModel();
		const waiterViewModel = new WaitersViewModel(model, new Api());
		waiterViewModel.waiters = mockListOfWaiters;
		expect(waiterViewModel.waiters).toEqual(mockListOfWaiters);
	});
});
