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
	},
];

const mockWarn = jest.fn();
beforeEach(() => {
	(mockWarn as unknown as jest.Mock).mockClear();
	jest.spyOn(console, 'warn').mockImplementation(mockWarn);

	jest.spyOn(console, 'info').mockImplementation(jest.fn());
	jest.spyOn(console, 'log').mockImplementation(jest.fn());
});

describe('update orders', () => {
	it('Sending no arguments', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		notifications.addNewOrder([]);
		expect(mockWarn).toBeCalledTimes(1);
	});

	it('Sending wrong arguments than required', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		notifications.addNewOrder([null, 'asd']);
		expect(mockWarn).toBeCalledTimes(1);
	});

	it('Sending exactly the needed arguments', () => {
		const model = new ordersModel();
		const ordersViewModel = new OrdersViewModel(model, new Api());
		const notifications = new Notifications(
			ordersViewModel,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		notifications.addNewOrder([mockListOfOrders]);
		expect(model.orders).toEqual(ordersViewModel.getOrders());
	});

	it('Sending extra argument is rejected', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		notifications.addNewOrder([[], 'inprogress', 'Hola Mr. Almog']);
		expect(mockWarn).toBeCalledTimes(1);
	});

	it('Sending something else than OrderIDO[] as orders', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			new WaitersViewModel(new waiterModel(), new Api())
		);

		notifications.addNewOrder(['asd']);
		console.log(ordersViewModels.getOrders());
		expect(mockWarn).toBeCalledTimes(1);
	});
});

//  {orderID: string; orderStatus: OrderStatus};
describe('update order status', () => {
	it('Sending no arguments', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		notifications.changeOrderStatus({});
		expect(mockWarn).toBeCalledTimes(1);
	});

	it('Sending wrong arguments than required', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		notifications.changeOrderStatus([null, 'asd']);
		expect(mockWarn).toBeCalledTimes(1);
	});

	it('Sending exactly the needed arguments', () => {
		const model = new ordersModel();
		const ordersViewModel = new OrdersViewModel(model, new Api());
		const notifications = new Notifications(
			ordersViewModel,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		ordersViewModel.setOrders(mockListOfOrders);
		notifications.changeOrderStatus({
			orderID: '1',
			orderStatus: 'on the way',
		});
		expect(model.orders[0].status).toEqual('on the way');
	});

	it('Checking if completion time is updated ', () => {
		const model = new ordersModel();
		const ordersViewModel = new OrdersViewModel(model, new Api());
		const notifications = new Notifications(
			ordersViewModel,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		ordersViewModel.setOrders(mockListOfOrders);
		notifications.changeOrderStatus({
			orderID: '1',
			orderStatus: 'delivered',
		});
		expect(model.orders[0].status).toEqual('delivered');
		expect(model.orders[0].completionTime).toBeDefined();
	});
});

describe('update orders', () => {
	it('Sending no arguments', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		notifications.addNewOrder([]);
		expect(mockWarn).toBeCalledTimes(1);
	});

	it('Sending wrong arguments than required', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		notifications.addNewOrder([null, 'asd']);
		expect(mockWarn).toBeCalledTimes(1);
	});

	it('Sending exactly the needed arguments', () => {
		const model = new ordersModel();
		const ordersViewModel = new OrdersViewModel(model, new Api());
		const notifications = new Notifications(
			ordersViewModel,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		notifications.addNewOrder([mockListOfOrders]);
		expect(model.orders).toEqual(ordersViewModel.getOrders());
	});

	it('Sending extra argument is rejected', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		notifications.addNewOrder([[], 'inprogress', 'Hola Mr. Almog']);
		expect(mockWarn).toBeCalledTimes(1);
	});

	it('Sending something else than OrderIDO[] as orders', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			new WaitersViewModel(new waiterModel(), new Api())
		);

		notifications.addNewOrder(['asd']);
		console.log(ordersViewModels.getOrders());
		expect(mockWarn).toBeCalledTimes(1);
	});
});

describe('adding a review', () => {
	it('Sending no arguments', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		notifications.addReview({});
		expect(mockWarn).toBeCalledTimes(1);
	});

	it('Sending wrong arguments than required', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		notifications.addReview([null, 'asd']);
		expect(mockWarn).toBeCalledTimes(1);
	});

	it('Sending exactly the needed arguments', () => {
		const model = new ordersModel();
		const ordersViewModel = new OrdersViewModel(model, new Api());
		const notifications = new Notifications(
			ordersViewModel,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		ordersViewModel.setOrders(mockListOfOrders);
		const review = {
			details: 'details',
			rating: 3,
		};
		notifications.addReview({orderID: '1', ...review});
		expect(ordersViewModel.getReview('1')).toEqual(review);
	});
});
