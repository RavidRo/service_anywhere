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
		items: new Map([
			['a', 2],
			['b', 3],
		]),
		status: 'received',
		guestId: '1',
		creationTime: new Date(),
		terminationTime: new Date(),
	},
	{
		id: '2',
		items: new Map([
			['c', 4],
			['d', 5],
		]),
		status: 'delivered',
		guestId: '2',
		creationTime: new Date(),
		terminationTime: new Date(),
	},
];
const mockWarn = jest.fn();
beforeEach(() => {
	(mockWarn as unknown as jest.Mock).mockClear();
	jest.spyOn(console, 'warn').mockImplementation(mockWarn);
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
		notifications.eventCallbacks.updateOrders([]);
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
		notifications.updateOrders([null, 'asd']);
		expect(mockWarn).toBeCalledTimes(1);
	});

	it('Sending exactly the needed arguments', () => {
		const ordersViewModel = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModel,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		notifications.eventCallbacks.updateOrders([[]]);
		expect(mockWarn).toBeCalledTimes(0);
	});

	it('Sending extra argument is accepted', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			new WaitersViewModel(new waiterModel(), new Api())
		);
		notifications.eventCallbacks.updateOrders([
			[],
			'inprogress',
			'Hola Mr. Almog',
		]);
		expect(mockWarn).toBeCalledTimes(0);
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

		notifications.eventCallbacks.updateOrders(['asd']);
		console.log(ordersViewModels.orders);
		expect(mockWarn).toBeCalledTimes(1);
	});
});

describe('update waiters', () => {
	it('Sending no arguments', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const waitersViewModels = new WaitersViewModel(
			new waiterModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			waitersViewModels
		);
		notifications.eventCallbacks.updateWaiters([]);
		expect(mockWarn).toBeCalledTimes(1);
	});

	it('Sending wrong arguments than required', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const waitersViewModels = new WaitersViewModel(
			new waiterModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			waitersViewModels
		);
		notifications.eventCallbacks.updateWaiters([null, 'asd']);
		expect(mockWarn).toBeCalledTimes(1);
	});

	it('Sending exactly the needed arguments', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const waitersViewModels = new WaitersViewModel(
			new waiterModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			waitersViewModels
		);
		notifications.eventCallbacks.updateWaiters([[]]);
		expect(mockWarn).toBeCalledTimes(0);
	});

	it('Sending extra argument is accepted', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const waitersViewModels = new WaitersViewModel(
			new waiterModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			waitersViewModels
		);
		notifications.eventCallbacks.updateWaiters([
			[],
			'inprogress',
			'Hola Mr. Almog',
		]);
		expect(mockWarn).toBeCalledTimes(0);
	});

	it('Sending something else than OrderIDO[] as orders', () => {
		const ordersViewModels = new OrdersViewModel(
			new ordersModel(),
			new Api()
		);
		const waitersViewModels = new WaitersViewModel(
			new waiterModel(),
			new Api()
		);
		const notifications = new Notifications(
			ordersViewModels,
			waitersViewModels
		);
		notifications.eventCallbacks.updateWaiters(['asd']);

		expect(mockWarn).toBeCalledTimes(1);
	});
});
