import Notifications from 'guests_app/src/Communication/Notification';
import OrderViewModel from 'guests_app/src/ViewModel/OrderViewModel';

const mockUpdateWaiterLocation = jest.fn();
const mockUpdateOrderStatus = jest.fn();

jest.mock('guests_app/src/ViewModel/OrderViewModel', () => {
	return jest.fn().mockImplementation(() => {
		return {
			updateWaiterLocation: mockUpdateWaiterLocation,
			updateOrderStatus: mockUpdateOrderStatus,
		};
	});
});

beforeEach(() => {
	(OrderViewModel as unknown as jest.Mock).mockClear();
	mockUpdateOrderStatus.mockClear();
	mockUpdateWaiterLocation.mockClear();
	jest.spyOn(console, 'warn').mockImplementation(jest.fn());
});

describe('updateWaiterLocation', () => {
	it('Sending no arguments', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.waiterLocationUpdate([]);
		expect(mockUpdateWaiterLocation).toBeCalledTimes(0);
	});

	it('Sending less arguments than required', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.waiterLocationUpdate(['Hey Ravid']);
		expect(mockUpdateWaiterLocation).toBeCalledTimes(0);
	});

	it('Sending exactly the needed arguments', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.waiterLocationUpdate([
			'Hey Ravid',
			{x: 15, y: -26},
		]);
		expect(mockUpdateWaiterLocation).toBeCalledTimes(1);
	});

	it('Sending extra argument is accepted', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.waiterLocationUpdate([
			'Hey Ravid',
			{x: 15, y: -26},
			'Hola Mr. Rom',
		]);
		expect(mockUpdateWaiterLocation).toBeCalledTimes(1);
	});

	it('Sending something else then string as guest id', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.waiterLocationUpdate([
			2,
			{x: 15, y: -26},
		]);
		notifications.eventToCallback.waiterLocationUpdate([
			{s: 'Ravid was here'},
			{x: 15, y: -26},
		]);
		expect(mockUpdateWaiterLocation).toBeCalledTimes(0);
	});

	it('Sending something else then location as guest location', () => {
		const notifications = new Notifications();
		[{z: 15, y: -26}, {x: 15}, {}, 2, '123'].forEach(location =>
			notifications.eventToCallback.waiterLocationUpdate([
				'Poopi',
				location,
			])
		);
		expect(mockUpdateWaiterLocation).toBeCalledTimes(0);
	});
});

describe('updateOrderStatus', () => {
	it('Sending no arguments', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.orderStatusChange([]);
		expect(mockUpdateOrderStatus).toBeCalledTimes(0);
	});

	it('Sending less arguments than required', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.orderStatusChange(['Hey Ravid']);
		expect(mockUpdateOrderStatus).toBeCalledTimes(0);
	});

	it('Sending exactly the needed arguments', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.orderStatusChange([
			'Hey Ravid',
			'inprogress',
		]);
		expect(mockUpdateOrderStatus).toBeCalledTimes(1);
	});

	it('Sending extra argument is accepted', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.orderStatusChange([
			'Hey Ravid',
			'inprogress',
			'Hola Mr. Rom',
		]);
		expect(mockUpdateOrderStatus).toBeCalledTimes(1);
	});

	it('Sending something else than string as order id', () => {
		const notifications = new Notifications();
		[{z: 15, y: -26}, {x: 15}, {}, 2, []].forEach(id =>
			notifications.eventToCallback.orderStatusChange([id, 'inprogress'])
		);
		expect(mockUpdateOrderStatus).toBeCalledTimes(0);
	});

	it('Sending something else than status as order status', () => {
		const notifications = new Notifications();
		[
			{z: 15, y: -26},
			{x: 15},
			{},
			2,
			[],
			'',
			'hey Ravid<3',
			undefined,
		].forEach(status =>
			notifications.eventToCallback.orderStatusChange(['id', status])
		);
		expect(mockUpdateOrderStatus).toBeCalledTimes(0);
	});
});
