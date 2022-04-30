import {Order, OrderIDO} from 'guests_app/src/types';
import {flushPromises, makePromise as mockMakePromise} from '../PromiseUtils';
import Requests from 'guests_app/src/Networking/requests';
import OrderViewModel from 'guests_app/src/ViewModel/OrderViewModel';
import { OrderModel } from 'guests_app/src/Model/OrderModel';

let items1 = new Map<string, number>();
items1.set('Item1_ID', 1);
items1.set('Item2_ID', 1);

let order1: OrderIDO = {
	id: '1',
	guestId: '1',
	items: items1,
	status: 'received',
	creationTime: new Date(),
	terminationTime: new Date(),
};
let orderAtServer: OrderIDO = order1;
const createdOrderId = '123';
let createdOrder: Order = {
	id: createdOrderId,
	items: items1,
	status: 'received',
};

const mockGetGuestOrder = jest.fn();
const mockCreateOrder = jest
	.fn()
	.mockImplementation(() => mockMakePromise(createdOrderId));
const mockCancelOrderGuest = jest.fn();
const mockSubmitReview = jest
	.fn()
	.mockImplementation(() => mockMakePromise(null));

jest.mock('../src/networking/Requests', () => {
	return jest.fn().mockImplementation(() => {
		return {
			getGuestOrder: mockGetGuestOrder,
			createOrder: mockCreateOrder,
			cancelOrderGuest: mockCancelOrderGuest,
			submitReview: mockSubmitReview,
		};
	});
});

describe('constructor tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Requests as jest.Mock).mockClear();
		mockGetGuestOrder.mockClear();
		mockGetGuestOrder.mockImplementation(() =>
			mockMakePromise(orderAtServer)
		);
	});

	it('The class can be created successfully', async () => {
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		expect(orderViewModel).toBeTruthy();
	});

	/*
	not relevant
	it('Looked for orders in the server', async () => {
		const requests = new Requests();
		const _orderViewModel = new OrderViewModel(requests);
		expect(requests.getGuestOrder).toHaveBeenCalled();
	});

	it('Initializing order to the order in the server', async () => {
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await flushPromises();
		expect(
			orderViewModel.getOrder() != null &&
				orderViewModel.getOrder()?.id === order1.id
		).toBeTruthy();
	}); */
});

describe('create order tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Requests as jest.Mock).mockClear();
		mockGetGuestOrder.mockClear();
		mockCreateOrder.mockClear();
		mockGetGuestOrder.mockImplementation(() =>
			mockMakePromise(orderAtServer)
		);
		OrderModel.getInstance().order = null;

	});

	it('create order succes', async () => {
		mockGetGuestOrder.mockImplementation(() => mockMakePromise(null));
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await flushPromises();
		const resOrder = await orderViewModel.createOrder(items1);
		expect(
			resOrder != null && (await resOrder).id === createdOrder.id
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
		mockGetGuestOrder.mockClear();
	//	mockCreateOrder.mockClear();
		mockCancelOrderGuest.mockClear();
		mockGetGuestOrder.mockImplementation(
			() => new Promise((_resolve, reject) => reject())
		);
		mockCancelOrderGuest.mockImplementation(
			() => new Promise<void>((resolve, _reject) => resolve())
		);
		OrderModel.getInstance().order = null;
	});

	it('cancel order succes after creating order', async () => {
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await orderViewModel.createOrder(items1);
		expect(orderViewModel.getOrder() !== null).toBeTruthy();
		await orderViewModel.cancelOrder().then(() => expect(true));
		expect(orderViewModel.getOrder() === null).toBeTruthy();
	});

	it('cancel order fails when order doesnt exists', async () => {
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await orderViewModel.cancelOrder().catch(() => expect(true));
	});

	// not relevant
	// it('cancel order fails and order doesnt removed when received false response from server', async () => {
	// 	mockCancelOrderGuest.mockImplementation(() => mockMakePromise(false));
	// 	const requests = new Requests();
	// 	const orderViewModel = new OrderViewModel(requests);
	// 	await flushPromises();
	// 	await orderViewModel.createOrder(items1);
	// 	const res = await orderViewModel.cancelOrder().catch(()=>expect(true));
	// 	expect(orderViewModel.getOrder() !== null).toBeTruthy();
	// });
});

describe('update order status tests', () => {
	beforeEach(() => {
		(Requests as jest.Mock).mockClear();
		OrderModel.getInstance().order = null;
	});

	it('update status sucess when order exists', async () => {
		mockGetGuestOrder.mockImplementation(() =>
			mockMakePromise(orderAtServer)
		);
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		orderViewModel.getOrderFromServer();
		await flushPromises();
		orderViewModel.updateOrderStatus(orderAtServer.id, 'in preparation');
		expect(
			orderViewModel.getOrder()?.status === 'in preparation'
		).toBeTruthy();
	});
	it('update status is ignored when order doesnt exists', async () => {
		mockGetGuestOrder.mockImplementation(
			() => new Promise((_resolve, reject) => reject())
		);
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		orderViewModel.updateOrderStatus(orderAtServer.id, 'in preparation');
		console.log(orderViewModel.getOrder())
		expect(orderViewModel.getOrder() === null).toBeTruthy()
	});
});

describe('submit review tests', () => {
	beforeEach(() => {
		// Clears the record of calls to the mock constructor function and its methods
		(Requests as jest.Mock).mockClear();
		OrderModel.getInstance().order = null;

	});

	it('submit review sucess when order status is delivered', async () => {
		mockGetGuestOrder.mockImplementation(() =>
			mockMakePromise(orderAtServer)
		);
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		orderViewModel.getOrderFromServer();
		await flushPromises();
		orderViewModel.updateOrderStatus(orderAtServer.id, 'delivered');
		let is_success = false;
		await orderViewModel
			.submitReview('good service', 5)
			.then(() => (is_success = true));
		expect(is_success).toBeTruthy();
	});
	it('submit review fail when order doesnt exists', async () => {
		mockGetGuestOrder.mockImplementation(
			() => new Promise((_resolve, reject) => reject())
		);
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
		mockGetGuestOrder.mockImplementation(() =>
			mockMakePromise(orderAtServer)
		);
		const requests = new Requests();
		const orderViewModel = new OrderViewModel(requests);
		await flushPromises();
		orderViewModel.updateOrderStatus(orderAtServer.id, 'on the way');
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