import {
	flushPromises,
	makePromise as mockMakePromise,
} from 'waiters_app/PromiseUtils';
import OrdersViewModel from 'waiters_app/src/ViewModel/OrdersViewModel';

const mockListOfOrders: OrderIdo[] = [
	{
		id: '1',
		items: {a: 2, b: 3},
		status: 'inprogress',
		guestID: '1',
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

const mockGuestLocation1 = {
	x: -5,
	y: 5,
};
const mockGuestLocation2 = {
	x: 12,
	y: 34,
};

const mockGetWaiterOrders = jest
	.fn()
	.mockImplementation(() => mockMakePromise(mockListOfOrders));

jest.mock('../src/networking/Requests', () => {
	return jest.fn().mockImplementation(() => {
		return {
			getWaiterOrders: mockGetWaiterOrders,
			orderArrived: () => {},
			login: () => mockMakePromise('id'),
		};
	});
});

import Requests from '../src/networking/Requests';
import {OrderIdo} from 'waiters_app/src/ido';
import Order from 'waiters_app/src/Models/Order';

beforeEach(() => {
	(Requests as unknown as jest.Mock).mockClear();
	mockGetWaiterOrders.mockClear();

	jest.useFakeTimers('legacy');
});

afterEach(() => {
	jest.clearAllTimers();
	jest.useRealTimers();
});

describe('Constructor', () => {
	test('The class can be created successfully', async () => {
		const ordersViewModel = new OrdersViewModel(new Requests());
		expect(ordersViewModel).toBeTruthy();
	});

	test('Looked for orders in the server', async () => {
		const ordersViewModel = new OrdersViewModel(new Requests());
		ordersViewModel.synchronizeOrders('id');
		await flushPromises();
		expect(mockGetWaiterOrders).toHaveBeenCalled();
	});

	test('Initializing orders to the orders in the server', async () => {
		const ordersViewModel = new OrdersViewModel(new Requests());
		ordersViewModel.synchronizeOrders('id');
		await flushPromises();
		expect(ordersViewModel.orders).toEqual(
			mockListOfOrders.map(ido => new Order(ido))
		);
	});

	test('The orders are starting with no location', async () => {
		const ordersViewModel = new OrdersViewModel(new Requests());
		ordersViewModel.synchronizeOrders('id');
		await flushPromises();
		expect(ordersViewModel.availableOrders).toEqual([]);
	});
});

describe('UpdateLocation', () => {
	test('Getting orders with available locations', async () => {
		const ordersViewModel = new OrdersViewModel(new Requests());
		ordersViewModel.synchronizeOrders('id');
		await flushPromises();
		ordersViewModel.updateGuestLocation(
			mockListOfOrders[0].guestID,
			mockGuestLocation1
		);
		expect(ordersViewModel.availableOrders).toEqual([
			{
				order: new Order(mockListOfOrders[0]),
				location: mockGuestLocation1,
			},
		]);
	});
	test('Getting the most updated location', async () => {
		const ordersViewModel = new OrdersViewModel(new Requests());
		ordersViewModel.synchronizeOrders('id');
		await flushPromises();
		ordersViewModel.updateGuestLocation(
			mockListOfOrders[0].guestID,
			mockGuestLocation1
		);
		ordersViewModel.updateGuestLocation(
			mockListOfOrders[1].guestID,
			mockGuestLocation1
		);
		ordersViewModel.updateGuestLocation(
			mockListOfOrders[1].guestID,
			mockGuestLocation2
		);
		expect(ordersViewModel.availableOrders).toEqual([
			{
				order: new Order(mockListOfOrders[0]),
				location: mockGuestLocation1,
			},
			{
				order: new Order(mockListOfOrders[1]),
				location: mockGuestLocation2,
			},
		]);
	});
});
