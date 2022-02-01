import {
	flushPromises,
	makePromise as mockMakePromise,
} from 'waiters_app/mocks/PromiseUtils';
import Order from 'waiters_app/src/Models/Order';
import OrdersViewModel from 'waiters_app/src/ViewModel/OrdersViewModel';

const mockListOfOrders: OrderIdo[] = [
	{
		id: '1',
		items: ['a', 'b'],
		status: 'inprogress',
	},
	{
		id: '2',
		items: ['a', 'b'],
		status: 'inprogress',
	},
];
const mockGuestLocation = {
	x: 0,
	y: 0,
};
const mockGetWaiterOrders = jest
	.fn()
	.mockImplementation(() => mockMakePromise(mockListOfOrders));
jest.mock('../src/networking/requests', () => {
	return jest.fn().mockImplementation(() => {
		return {
			getWaiterOrders: mockGetWaiterOrders,
			getGuestLocation: () =>
				mockMakePromise<Location>(mockGuestLocation),
			orderArrived: () => {},
			login: () => mockMakePromise('id'),
		};
	});
});

const order1 = new Order({
	id: '1',
	items: ['a', 'b'],
	status: 'inprogress',
});
order1.location = mockGuestLocation;
const mockOrders = [
	order1,
	new Order({
		id: '2',
		items: ['a', 'b'],
		status: 'completed',
	}),
];
const mockSetOrders = jest.fn();
const mockSetGuestLocation = jest.fn();
jest.mock('../src/Models/OrderModel', () => {
	return jest.fn().mockImplementation(() => {
		return {
			orders: mockOrders,
			setOrders: mockSetOrders,
			setLocation: mockSetGuestLocation,
		};
	});
});

import Requests from '../src/networking/requests';
import OrderModel from '../src/Models/OrderModel';

beforeEach(() => {
	(Requests as unknown as jest.Mock).mockClear();
	(OrderModel as unknown as jest.Mock).mockClear();
	mockSetOrders.mockClear();
	mockGetWaiterOrders.mockClear();
	mockSetGuestLocation.mockClear();

	jest.useFakeTimers('legacy');
});

afterEach(() => {
	jest.clearAllTimers();
	jest.useRealTimers();
});

describe('Constructor', () => {
	test('The class can be created successfully', async () => {
		const orders = new OrdersViewModel('0');
		expect(orders).toBeTruthy();
	});

	test('Looked for orders in the server', async () => {
		const _ordersViewModel = new OrdersViewModel('0');
		expect(mockGetWaiterOrders).toHaveBeenCalled();
	});

	test('Initializing orders to the orders in the server', async () => {
		expect.assertions(2);
		const _ordersViewModel = new OrdersViewModel('0');
		await flushPromises();
		expect(mockSetOrders).toHaveBeenCalledTimes(1);
		expect(mockSetOrders.mock.calls[0][0]).toHaveLength(
			mockListOfOrders.length
		);
	});
});

test('Getting only the available orders', async () => {
	expect.assertions(1);
	const ordersViewModel = new OrdersViewModel('0');
	await flushPromises();
	expect(ordersViewModel.availableOrders).toEqual([order1]);
});
