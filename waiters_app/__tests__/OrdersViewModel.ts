import {
	flushPromises,
	makePromise as mockMakePromise,
} from 'waiters_app/PromiseUtils';
import Order from 'waiters_app/src/Models/Order';
import OrdersViewModel from 'waiters_app/src/ViewModel/OrdersViewModel';

const mockListOfOrders: OrderIdo[] = [
	{
		id: '1',
		items: {a: 2, b: 3},
		status: 'inprogress',
		guestID: '2',
		creationTime: new Date(),
		terminationTime: new Date(),
	},
	{
		id: '2',
		items: {a: 2, b: 3},
		status: 'completed',
		guestID: '2',
		creationTime: new Date(),
		terminationTime: new Date(),
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
	items: {a: 2, b: 3},
	status: 'inprogress',
	guestID: '2',
	creationTime: new Date(),
	terminationTime: new Date(),
});
order1.location = mockGuestLocation;
const mockOrders = [
	order1,
	new Order({
		id: '2',
		items: {a: 2, b: 3},
		status: 'completed',
		guestID: '2',
		creationTime: new Date(),
		terminationTime: new Date(),
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

import Requests from '../src/networking/Requests';
import OrderModel from '../src/Models/OrderModel';
import {Location, OrderIdo} from 'waiters_app/src/ido';

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
		const orders = new OrdersViewModel('0', new Requests());
		expect(orders).toBeTruthy();
	});

	test('Looked for orders in the server', async () => {
		const _ordersViewModel = new OrdersViewModel('0', new Requests());
		expect(mockGetWaiterOrders).toHaveBeenCalled();
	});

	test('Initializing orders to the orders in the server', async () => {
		expect.assertions(2);
		const _ordersViewModel = new OrdersViewModel('0', new Requests());
		await flushPromises();
		expect(mockSetOrders).toHaveBeenCalledTimes(1);
		expect(mockSetOrders.mock.calls[0][0]).toHaveLength(
			mockListOfOrders.length
		);
	});
});

test('Getting only the available orders', async () => {
	expect.assertions(1);
	const ordersViewModel = new OrdersViewModel('0', new Requests());
	await flushPromises();
	expect(ordersViewModel.availableOrders).toEqual([order1]);
});
