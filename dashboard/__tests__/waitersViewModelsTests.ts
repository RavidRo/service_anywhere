import {flushPromises, makePromise as mockMakePromise} from '../PromiseUtils';
import WaitersViewModel from '../src/viewModel/waitersViewModel';
import Api from '../src/network/api';
import waiterModel from '../src/model/waiterModel';
import {OrderIDO, WaiterIDO} from '../../api';

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
		username: 'waiter 1',
	},
	{
		id: '2',
		username: 'waiter 2',
	},
];
const mockGetOrders = jest.fn(() => mockMakePromise(mockListOfOrders));
const mockGetWaiters = jest.fn(() => mockMakePromise(mockListOfWaiters));
const mockAssignWaiter = jest.fn((_orderId: string, waiterIds: string[]) => {
	return mockListOfWaiters.filter(waiter => waiter.id in waiterIds);
});
const mockGetWaitersByOrder = jest.fn(
	(_orderId: string) => mockListOfOrders[0]
);
const mockChangeOrderStatus = jest.fn(
	(_orderId: string, _status: string) => true
);
const mockCancelOrder = jest.fn((_orderId: string) => true);

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

beforeEach(() => {
	(Api as unknown as jest.Mock).mockClear();
	mockGetOrders.mockClear();
	mockGetWaiters.mockClear();

	jest.spyOn(console, 'info').mockImplementation(jest.fn());
	jest.spyOn(console, 'log').mockImplementation(jest.fn());
	jest.spyOn(console, 'warn').mockImplementation(jest.fn());
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
		waiterViewModel.assignWaiter('1', ['1', '2']);
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

	test('get waiters in model', async () => {
		const model = new waiterModel();
		const waiterViewModel = new WaitersViewModel(model, new Api());
		waiterViewModel.setWaiters(mockListOfWaiters);
		const waiters = waiterViewModel.getWaiters();
		expect(waiters).toEqual(mockListOfWaiters);
	});

	test('synchronise waiters in model', async () => {
		const model = new waiterModel();
		const waiterViewModel = new WaitersViewModel(model, new Api());
		waiterViewModel.synchroniseWaiters();
		await flushPromises();
		const waiters = waiterViewModel.getWaiters();
		expect(waiters).toEqual(mockListOfWaiters);
	});
});
