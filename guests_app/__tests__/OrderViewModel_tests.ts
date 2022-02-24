import {Item, Order, OrderID} from 'guests_app/src/types';
import {flushPromises, makePromise as mockMakePromise} from '../PromiseUtils';
import Requests from 'guests_app/src/Networking/requests';
import {OrderModel} from 'guests_app/src/Model/OrderModel';
import OrderViewModel from 'guests_app/src/ViewModel/OrderViewModel';
import {OrderIDO} from 'guests_app/src/ido';
import {mocked} from 'ts-jest/utils';

let items1 = new Map<string, number>();
items1.set('Item1_ID', 1);
items1.set('Item2_ID', 1);

let order1: OrderIDO = {
	id: '1',
	guestId: '1',
	items: items1,
	status: 'recieved',
	creationTime: new Date(),
	terminationTime: new Date(),
};
let orderAtServer: OrderIDO[] = [order1];
const createdOrderId = '123';
let createdOrder: Order = {
	id: createdOrderId,
	items: items1,
	status: 'recieved',
};

const mockGetMyOrders = jest.fn();
const mockCreateOrder = jest
	.fn()
	.mockImplementation(() => mockMakePromise(createdOrderId));
const mockCancelOrder = jest.fn();
const mockSubmitReview = jest
	.fn()
	.mockImplementation(() => mockMakePromise(null));

jest.mock('../src/networking/Requests', () => {
	return jest.fn().mockImplementation(() => {
		return {
			getMyOrders: mockGetMyOrders,
			createOrder: mockCreateOrder,
			cancelOrder: mockCancelOrder,
			submitReview: mockSubmitReview,
		};
	});
});

describe('constructor tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Requests as jest.Mock).mockClear();
		mockGetMyOrders.mockClear();
		mockGetMyOrders.mockImplementation(() =>
			mockMakePromise(orderAtServer)
		);
	});

	it('The class can be created successfully', async () => {
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		expect(orderViewModel).toBeTruthy();
	});

	it('Looked for orders in the server', async () => {
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		expect(requests.getMyOrders).toHaveBeenCalled();
	});

	it('Initializing order to the order in the server', async () => {
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await flushPromises();
		expect(
			orderViewModel.getOrder() != null &&
				orderViewModel.getOrder()?.id == order1.id
		).toBeTruthy();
	});
});

describe('create order tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Requests as jest.Mock).mockClear();
		mockGetMyOrders.mockClear();
		mockCreateOrder.mockClear();
		mockGetMyOrders.mockImplementation(() =>
			mockMakePromise(orderAtServer)
		);
	});

	it('create order succes', async () => {
		mockGetMyOrders.mockImplementation(() => mockMakePromise([]));
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await flushPromises();
		const resOrder = await orderViewModel.createOrder(items1);
		expect(
			resOrder != null && (await resOrder).id == createdOrder.id
		).toBeTruthy();
	});

	it('create order fail when order exists', async () => {
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await flushPromises();
		await orderViewModel.createOrder(items1).catch(() => expect(true));
	});
});

describe('cancel order tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Requests as jest.Mock).mockClear();
		mockGetMyOrders.mockClear();
		mockCreateOrder.mockClear();
		mockCancelOrder.mockClear();
		mockGetMyOrders.mockImplementation(() => mockMakePromise([]));
		mockCancelOrder.mockImplementation(() => mockMakePromise(true));
	});

	it('cancel order succes after creating order', async () => {
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await flushPromises();
		await orderViewModel.createOrder(items1);
		expect(orderViewModel.getOrder() != null).toBeTruthy();
		const res = await orderViewModel.cancelOrder();
		expect(res).toBeTruthy();
		expect(orderViewModel.getOrder() == null).toBeTruthy();
	});

	it('cancel order fails when order doesnt exists', async () => {
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await orderViewModel.cancelOrder().catch(() => expect(true));
	});

	it('cancel order fails and order doesnt removed when received false response from server', async () => {
		mockCancelOrder.mockImplementation(() => mockMakePromise(false));
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await flushPromises();
		await orderViewModel.createOrder(items1);
		const res = await orderViewModel.cancelOrder();
		expect(res).toBeFalsy();
		expect(orderViewModel.getOrder() != null).toBeTruthy();
	});
});
describe('update order status tests', () => {
	it('update status sucess when order exists', async () => {
		mockGetMyOrders.mockImplementation(() =>
			mockMakePromise(orderAtServer)
		);
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await flushPromises();
		orderViewModel.updateOrderStatus(orderAtServer[0].id, 'inprogress');
		expect(orderViewModel.getOrder()?.status == 'inprogress').toBeTruthy();
	});
	it('update status is ignored when order doesnt exists', async () => {
		mockGetMyOrders.mockImplementation(() => mockMakePromise([]));
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await flushPromises();
		orderViewModel.updateOrderStatus(orderAtServer[0].id, 'inprogress');
		expect(orderViewModel.getOrder() == null).toBeTruthy();
	});
});

describe('submit review tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Requests as jest.Mock).mockClear();
	});

	it('submit review sucess when order status is arrived', async () => {
		mockGetMyOrders.mockImplementation(() =>
			mockMakePromise(orderAtServer)
		);
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await flushPromises();
		orderViewModel.updateOrderStatus(orderAtServer[0].id, 'arrived');
		let is_success = false;
		await orderViewModel
			.submitReview('good service', 5)
			.then(() => (is_success = true));
		expect(is_success).toBeTruthy();
	});
	it('submit review fail when order doesnt exists', async () => {
		mockGetMyOrders.mockImplementation(() => mockMakePromise([]));
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await flushPromises();
		let is_fail = false;
		await orderViewModel
			.submitReview('good service', 5)
			.catch(() => (is_fail = true));
		expect(is_fail).toBeTruthy();
	});
	it('submit review fail when order status isnt arrived', async () => {
		mockGetMyOrders.mockImplementation(() =>
			mockMakePromise(orderAtServer)
		);
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await flushPromises();
		orderViewModel.updateOrderStatus(orderAtServer[0].id, 'on the way');
		let is_fail = false;
		await orderViewModel
			.submitReview('good service', 5)
			.catch(() => (is_fail = true));
		expect(is_fail).toBeTruthy();
	});
});
/**
 @todo: add waiters lcoations tests
**/
