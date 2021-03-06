import {flushPromises, makePromise as mockMakePromise} from '../PromiseUtils';
import OrderViewModel from '../src/viewModel/ordersViewModel';
import Api from '../src/network/api';
import ordersModel from '../src/model/ordersModel';
import {ItemIDO, OrderIDO, WaiterIDO} from '../../api';
import {initViewModels, waitersViewModel} from '../src/context';

const mockListOfItems: ItemIDO[] = [
	{
		id: '57480f63-1361-45ee-9fab-46b8042464ce',
		name: 'Banana',
		preparationTime: 25,
		price: 5.2,
	},
	{
		id: 'b5b561b8-6ffc-49cf-825f-54eefeeb071d',
		name: 'Bamba',
		preparationTime: 5,
		price: 8.9,
	},
];
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
		review: undefined,
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
		review: {
			details: 'details',
			rating: 3,
		},
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
const mockChangeOrderStatus = jest.fn((_orderId: string, _status: string) =>
	Promise.resolve()
);
const mockCancelOrder = jest.fn((_orderId: string) => true);

const mockGetItems = jest.fn(() => Promise.resolve(mockListOfItems));
jest.mock('../src/network/api', () => {
	return jest.fn().mockImplementation(() => {
		return {
			getOrders: mockGetOrders,
			getWaiters: mockGetWaiters,
			assignWaiter: mockAssignWaiter,
			getWaitersByOrder: mockGetWaitersByOrder,
			changeOrderStatus: mockChangeOrderStatus,
			cancelOrder: mockCancelOrder,
			getItems: mockGetItems,
		};
	});
});
let api: Api;
let orderModel: ordersModel;
let ordersViewModel: OrderViewModel;

beforeEach(() => {
	initViewModels();
	api = new Api();
	orderModel = new ordersModel();
	ordersViewModel = new OrderViewModel(orderModel, api);
	(Api as unknown as jest.Mock).mockClear();
	mockGetOrders.mockClear();

	jest.spyOn(console, 'info').mockImplementation(jest.fn());
	jest.spyOn(console, 'log').mockImplementation(jest.fn());
	jest.spyOn(console, 'warn').mockImplementation(jest.fn());
});

describe('Constructor', () => {
	test('The class can be created successfully', async () => {
		expect(ordersViewModel).toBeTruthy();
	});

	test('Change order status in server expect false', async () => {
		ordersViewModel
			.changeOrderStatus('1', 'in preparation')
			.then(r => expect(r).toBeTruthy());
	});

	test('Change order status in server expect true', async () => {
		mockChangeOrderStatus.mockImplementation(() => Promise.reject());
		ordersViewModel
			.changeOrderStatus('1', 'in preparation')
			.catch(r => expect(r).toBeTruthy());
	});

	test('Set and get orders in model', async () => {
		ordersViewModel.setOrders(mockListOfOrders);
		expect(ordersViewModel.getOrders()).toEqual(orderModel.orders);
	});

	test('Set and get review in model', async () => {
		ordersViewModel.setOrders(mockListOfOrders);
		expect(ordersViewModel.getReview('2')).toEqual(
			mockListOfOrders[1].review
		);
	});

	test('synchronise orders in model', async () => {
		ordersViewModel.synchroniseOrders();
		await flushPromises();
		const _ = ordersViewModel.getOrders();
		expect(mockGetOrders).toHaveBeenCalled();
	});

	test('synchronise items in model', async () => {
		ordersViewModel.synchroniseItems();
		await flushPromises();
		const items = ordersViewModel.getItems();
		expect(items).toEqual(mockListOfItems);
	});

	test('update waiters of order', async () => {
		ordersViewModel.setOrders(mockListOfOrders);
		ordersViewModel.updateAssignedWaiter(mockListOfOrders[0].id, [
			mockListOfWaiters[0].id,
		]);
		await flushPromises();
		expect(
			waitersViewModel.getAssignedWaiters(mockListOfOrders[0].id)
		).toEqual([mockListOfWaiters[0].id]);
	});

	test('update waiters of order to empty array', async () => {
		ordersViewModel.setOrders(mockListOfOrders);
		ordersViewModel.updateAssignedWaiter(mockListOfOrders[0].id, [
			mockListOfWaiters[0].id,
		]);
		ordersViewModel.updateAssignedWaiter(mockListOfOrders[0].id, []);
		await flushPromises();
		expect(
			waitersViewModel.getAssignedWaiters(mockListOfOrders[0].id)
		).toEqual([]);
	});
});
