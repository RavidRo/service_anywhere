import { Item, Order } from 'guests_app/src/types';
import {
	flushPromises,
	makePromise as mockMakePromise,
} from '../PromiseUtils';
import Requests from 'guests_app/src/Networking/requests';
import { OrderModel } from 'guests_app/src/Model/OrderModel';
import OrderViewModel from 'guests_app/src/ViewModel/OrderViewModel';

let items1: Order["items"] = new Map()
items1.set('Item1_ID', 1)
items1.set('Item2_ID', 1)
const order1: Order = {
	id: '1',
	items: items1,
	status: 'recieved',
};

const mockGetMyOrders = jest
	.fn()
	.mockImplementation(() => mockMakePromise(order1));

// jest.mock('../src/networking/Requests', () => {
// 	return jest.fn().mockImplementation(() => {
// 		return {
// 			getWaiterOrders: mockGetWaiterOrders,
// 			getGuestLocation: () =>
// 				mockMakePromise<Location>(mockGuestLocation),
// 			orderArrived: () => {},
// 			login: () => mockMakePromise('id'),
// 		};
// 	});
// });


const mockSetOrders = jest.fn();
jest.mock('../src/Model/OrderModel', () => {
	return jest.fn().mockImplementation(() => {
		return {
			getOrder: mockGetMyOrders,
		};
	});
});


beforeEach(() => {
	// (Requests as unknown as jest.Mock).mockClear();
	(OrderModel as unknown as jest.Mock).mockClear();
	mockSetOrders.mockClear();

	jest.useFakeTimers('legacy');
});

afterEach(() => {
	jest.clearAllTimers();
	jest.useRealTimers();
});

describe('Constructor', () => {
	test('The class can be created successfully', async () => {
		const orders = new OrderViewModel(new Requests());
		expect(orders).toBeTruthy();
	});

	test('Looked for orders in the server', async () => {
		const _orderViewModel = new OrderViewModel(new Requests());
		expect(mockGetMyOrders).toHaveBeenCalled();
	});

	test('Initializing order to the order in the server', async () => {
		expect.assertions(2);
		const _ordersViewModel = new OrderViewModel(new Requests());
		await flushPromises();
		expect(mockSetOrders).toHaveBeenCalledTimes(1);
		expect(_ordersViewModel.getOrder() != null && _ordersViewModel.getOrder()?.id == order1.id)
	});
});


