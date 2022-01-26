// import Location from '../src/data/Location';

import Location from '../src/data/Location';
import Order from '../src/data/Order';
import ServerLocation from '../src/location_services/ServerLocation';

const mockWatchLocation = jest.fn().mockImplementation(onSuccess => {
	onSuccess(new Location(1, 1));
});
const mockStopWatching = jest.fn();
jest.mock('../src/location_services/ServerLocation', () => {
	return jest.fn().mockImplementation(() => {
		return {
			watchLocation: mockWatchLocation,
			stopWatching: mockStopWatching,
		};
	});
});

beforeEach(() => {
	(ServerLocation as jest.Mock).mockClear();
	mockWatchLocation.mockClear();
	mockStopWatching.mockClear();
});

describe('Creating an order', () => {
	it('Order should create a location service', () => {
		const _ = new Order({id: '', items: [], status: 'inprogress'});
		expect(ServerLocation).toHaveBeenCalledTimes(1);
	});

	it('Order should not start tracking before it was told', () => {
		const _ = new Order({id: '', items: [], status: 'inprogress'});
		expect(mockWatchLocation.mock.calls.length).toBe(0);
	});
});

describe('Watch Location', () => {
	it('Call onNewLocation when location s updated', () => {
		const order = new Order({id: '', items: [], status: 'inprogress'});
		order.onNewLocation(location => {
			expect(location).toEqual(new Location(1, 1));
		});
		expect(mockWatchLocation).toHaveBeenCalledTimes(1);
	});

	it('Call stopWatching when watching', () => {
		const order = new Order({id: '', items: [], status: 'inprogress'});
		order.onNewLocation(_ => {});
		expect(mockStopWatching).toHaveBeenCalledTimes(1);
	});
});

describe('Complete order', () => {
	it('Sops watching location', () => {
		const order = new Order({id: '', items: [], status: 'inprogress'});
		order.completed();
		expect(mockStopWatching).toHaveBeenCalledTimes(1);
	});
});
