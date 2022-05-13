import {flushPromises, makePromise as mockMakePromise} from '../PromiseUtils';
import OrderViewModel from '../src/viewModel/ordersViewModel';
import Api from '../src/network/api';
import ordersModel from '../src/model/ordersModel';
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
const mockAssignWaiter = jest.fn((orderId: string, waiterId: string) => {
	return mockListOfWaiters.filter(waiter => waiter.id === waiterId)[0]
		.available;
});
const mockGetWaitersByOrder = jest.fn((orderId: string) => mockListOfOrders[0]);
const mockChangeOrderStatus = jest.fn((orderId: string, status: string) =>
	Promise.resolve()
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
		ordersViewModel
			.changeOrderStatus('1', 'in preparation')
			.then(r => expect(r).toBeTruthy());
	});

	test('Change order status in server epect true', async () => {
		mockChangeOrderStatus.mockImplementation(() => Promise.reject());
		const ordersViewModel = new OrderViewModel(
			new ordersModel(),
			new Api()
		);
		ordersViewModel
			.changeOrderStatus('1', 'in preparation')
			.catch(r => expect(r).toBeTruthy());
	});

	test('Set and get orders in model', async () => {
		const model = new ordersModel();
		const ordersViewModel = new OrderViewModel(model, new Api());
		ordersViewModel.setOrders(mockListOfOrders);
		expect(ordersViewModel.getOrders()).toEqual(model.orders);
	});

	test('synchronise orders in model', async () => {
		const model = new ordersModel();
		const ordersViewModel = new OrderViewModel(model, new Api());
		ordersViewModel.synchroniseOrders();
		await flushPromises();
		const orders = ordersViewModel.getOrders();
		expect(mockGetOrders).toHaveBeenCalled();
	});
});
