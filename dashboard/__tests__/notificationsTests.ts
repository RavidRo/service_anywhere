import Notifications from '../src/network/notifications';
import WaitersViewModel from 'dashboard/src/viewModel/waitersViewModel';
import OrdersViewModel from 'dashboard/src/viewModel/ordersViewModel';
import ordersModel from '../src/model/ordersModel';
import Api from '../src/network/api';
import waiterModel from '../src/model/waiterModel';
import {OrderIDO} from '../../api';

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
		completionTime: undefined,
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

const mockWarn = jest.fn();
let api: Api;
let orderModel: ordersModel;
let ordersViewModel: OrdersViewModel;
let notifications: Notifications;

beforeEach(() => {
	api = new Api();
	orderModel = new ordersModel();
	ordersViewModel = new OrdersViewModel(orderModel, api);
	notifications = new Notifications(
		ordersViewModel,
		new WaitersViewModel(new waiterModel(), api)
	);

	(mockWarn as unknown as jest.Mock).mockClear();
	jest.spyOn(console, 'warn').mockImplementation(mockWarn);

	jest.spyOn(console, 'info').mockImplementation(jest.fn());
	jest.spyOn(console, 'log').mockImplementation(jest.fn());
});

describe('update orders', () => {
	it('Sending no arguments', () => {
		notifications.addNewOrder([]);
		expect(ordersViewModel.getOrders().length).toBe(0);
	});

	it('Sending wrong arguments than required', () => {
		notifications.addNewOrder([null, 'asd']);
		expect(ordersViewModel.getOrders().length).toBe(0);
	});

	it('Sending exactly the needed arguments', () => {
		notifications.addNewOrder([mockListOfOrders]);
		expect(orderModel.orders).toEqual(ordersViewModel.getOrders());
	});

	it('Sending extra argument is rejected', () => {
		notifications.addNewOrder([[], 'inprogress', 'Hola Mr. Almog']);
		expect(ordersViewModel.getOrders().length).toBe(0);
	});

	it('Sending something else than OrderIDO[] as orders', () => {
		notifications.addNewOrder(['asd']);
		console.log(ordersViewModel.getOrders());
		expect(ordersViewModel.getOrders().length).toBe(0);
	});
});

//  {orderID: string; orderStatus: OrderStatus};
describe('update order status', () => {
	it('Sending no arguments', () => {
		ordersViewModel.setOrders(mockListOfOrders);
		notifications.changeOrderStatus({});
		expect(ordersViewModel.getOrders()).toEqual(mockListOfOrders);
	});

	it('Sending wrong arguments than required', () => {
		ordersViewModel.setOrders(mockListOfOrders);
		notifications.changeOrderStatus([null, 'asd']);
		expect(ordersViewModel.getOrders()).toEqual(mockListOfOrders);
	});

	it('Sending exactly the needed arguments', () => {
		ordersViewModel.setOrders(mockListOfOrders);
		notifications.changeOrderStatus({
			orderID: '1',
			orderStatus: 'on the way',
		});
		expect(orderModel.orders[0].status).toEqual('on the way');
	});

	it('Checking if completion time is updated ', () => {
		ordersViewModel.setOrders(mockListOfOrders);
		notifications.changeOrderStatus({
			orderID: '1',
			orderStatus: 'delivered',
		});
		expect(orderModel.orders[0].status).toEqual('delivered');
		expect(orderModel.orders[0].completionTime).toBeDefined();
	});
});

describe('adding a review', () => {
	it('Sending no arguments', () => {
		ordersViewModel.setOrders(mockListOfOrders);
		notifications.addReview({});
		expect(ordersViewModel.getReview('1')).toEqual(undefined);
	});

	// it('Sending wrong arguments than required', () => {
	// 	ordersViewModel.setOrders(mockListOfOrders);
	// 	notifications.addReview([null, 'asd']);
	// 	expect(orderModel.reviews).toEqual([]);
	// });

	it('Sending exactly the needed arguments', () => {
		ordersViewModel.setOrders(mockListOfOrders);
		const review = {
			details: 'details',
			rating: 3,
		};
		notifications.addReview({orderID: '1', ...review});
		expect(ordersViewModel.getReview('1')).toEqual(review);
	});
});
