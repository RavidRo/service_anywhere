import Notifications from 'waiters_app/src/communication/Notifications';

const mockUpdateGuestLocation = jest.fn();
const mockUpdateOrderStatus = jest.fn();

jest.mock('waiters_app/src/ViewModel/OrderViewModel', () => {
	return jest.fn().mockImplementation(() => {
		return {
			updateGuestLocation: mockUpdateGuestLocation,
			updateOrderStatus: mockUpdateOrderStatus,
			synchronizeOrders: () => {},
			availableOrders: [],
			guests: [],
			orders: [],
		};
	});
});

import OrderViewModel from 'waiters_app/src/ViewModel/OrderViewModel';

beforeEach(() => {
	(OrderViewModel as unknown as jest.Mock).mockClear();
	mockUpdateOrderStatus.mockClear();
	mockUpdateGuestLocation.mockClear();
	jest.spyOn(console, 'warn').mockImplementation(jest.fn());
});

describe('updateGuestLocation', () => {
	it('Sending no arguments', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.updateGuestLocation([]);
		expect(mockUpdateGuestLocation).toBeCalledTimes(0);
	});

	it('Sending less arguments than required', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.updateGuestLocation(['Hey Aviv']);
		expect(mockUpdateGuestLocation).toBeCalledTimes(0);
	});

	it('Sending exactly the needed arguments', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.updateGuestLocation([
			'Hey Aviv',
			{x: 15, y: -26},
		]);
		expect(mockUpdateGuestLocation).toBeCalledTimes(1);
	});

	it('Sending extra argument is accepted', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.updateGuestLocation([
			'Hey Aviv',
			{x: 15, y: -26},
			'Hola Mr. Almog',
		]);
		expect(mockUpdateGuestLocation).toBeCalledTimes(1);
	});

	it('Sending something else then string as guest id', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.updateGuestLocation([2, {x: 15, y: -26}]);
		notifications.eventToCallback.updateGuestLocation([
			{s: 'Aviv was here'},
			{x: 15, y: -26},
		]);
		expect(mockUpdateGuestLocation).toBeCalledTimes(0);
	});

	it('Sending something else then location as guest location', () => {
		const notifications = new Notifications();
		[{z: 15, y: -26}, {x: 15}, {}, 2, '123'].forEach(location =>
			notifications.eventToCallback.updateGuestLocation([
				'Poopi',
				location,
			])
		);
		expect(mockUpdateGuestLocation).toBeCalledTimes(0);
	});
});

describe('updateOrderStatus', () => {
	it('Sending no arguments', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.updateOrderStatus([]);
		expect(mockUpdateOrderStatus).toBeCalledTimes(0);
	});

	it('Sending less arguments than required', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.updateOrderStatus(['Hey Aviv']);
		expect(mockUpdateOrderStatus).toBeCalledTimes(0);
	});

	it('Sending exactly the needed arguments', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.updateOrderStatus([
			'Hey Aviv',
			'inprogress',
		]);
		expect(mockUpdateOrderStatus).toBeCalledTimes(1);
	});

	it('Sending extra argument is accepted', () => {
		const notifications = new Notifications();
		notifications.eventToCallback.updateOrderStatus([
			'Hey Aviv',
			'inprogress',
			'Hola Mr. Almog',
		]);
		expect(mockUpdateOrderStatus).toBeCalledTimes(1);
	});

	it('Sending something else than string as order id', () => {
		const notifications = new Notifications();
		[{z: 15, y: -26}, {x: 15}, {}, 2, []].forEach(id =>
			notifications.eventToCallback.updateOrderStatus([id, 'inprogress'])
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
			'hey aviv<3',
			undefined,
		].forEach(status =>
			notifications.eventToCallback.updateOrderStatus(['id', status])
		);
		expect(mockUpdateOrderStatus).toBeCalledTimes(0);
	});
});
