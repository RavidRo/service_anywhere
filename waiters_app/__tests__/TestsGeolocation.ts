import Geolocation from 'waiters_app/src/localization/Geolocation';
import {GPS} from 'waiters_app/src/map';

const mockStopWatching = jest.fn();
const mockGetLocation = jest.fn();
const mockWatchLocation = jest.fn();
jest.mock('waiters_app/src/localization/GeolocationAdapter', () => {
	return jest.fn().mockImplementation(() => {
		return {
			watchLocation: mockWatchLocation,
			stopWatching: mockStopWatching,
			getLocation: mockGetLocation,
		};
	});
});

import GeolocationAdapter from 'waiters_app/src/localization/GeolocationAdapter';
import {Corners} from 'waiters_app/src/ido';

beforeEach(() => {
	(GeolocationAdapter as unknown as jest.Mock).mockClear();
	mockGetLocation.mockClear();
	mockGetLocation.mockImplementation((onSuccess: (location: GPS) => void) => {
		onSuccess({
			longitude: 0.5,
			latitude: 0.5,
		});
	});
	mockWatchLocation.mockClear();
	mockWatchLocation.mockImplementation(
		(onSuccess: (location: GPS) => void) => {
			onSuccess({
				longitude: 0.5,
				latitude: 0.5,
			});
		}
	);
	mockStopWatching.mockClear();
});

const corners: Corners = {
	bottomLeftGPS: {
		latitude: 0,
		longitude: 0,
	},
	bottomRightGPS: {
		latitude: 0,
		longitude: 2,
	},
	topLeftGPS: {
		latitude: 2,
		longitude: 0,
	},
	topRightGPS: {
		latitude: 2,
		longitude: 2,
	},
};
describe('getLocation', () => {
	it('Get location calls the on success callback', async () => {
		expect.assertions(1);
		const geolocation = new Geolocation(corners);
		geolocation.getLocation(
			location => expect(location).toBeTruthy(),
			() => {}
		);
	});

	it('Get location translate the location successfully', async () => {
		expect.assertions(2);
		const geolocation = new Geolocation(corners);
		geolocation.getLocation(
			location =>
				expect(location).toEqual({
					x: 0.25,
					y: 0.75,
				}),
			() => {}
		);
		mockGetLocation.mockImplementation(
			(onSuccess: (location: GPS) => void) => {
				onSuccess({
					longitude: 1,
					latitude: 1,
				});
			}
		);
		geolocation.getLocation(
			location =>
				expect(location).toEqual({
					x: 0.5,
					y: 0.5,
				}),
			() => {}
		);
	});

	it('Calls the onError call back when theres an error', () => {
		expect.assertions(2);
		const geolocation = new Geolocation(corners);
		mockGetLocation.mockImplementation((_, onError) => {
			onError('Failed1');
		});
		geolocation.getLocation(
			() => {},
			error => {
				expect(error).toBe('Failed1');
			}
		);
		mockGetLocation.mockImplementation((_, onError) => {
			onError('Failed2');
		});
		geolocation.getLocation(
			() => {},
			error => {
				expect(error).toBe('Failed2');
			}
		);
	});
});

describe('watchLocation', () => {
	it('Watch location calls the on success callback', async () => {
		expect.assertions(1);
		const geolocation = new Geolocation(corners);
		geolocation.watchLocation(
			location => expect(location).toBeTruthy(),
			() => {}
		);
	});

	it('Watch location translate the location successfully', async () => {
		expect.assertions(2);
		const geolocation = new Geolocation(corners);
		geolocation.watchLocation(
			location =>
				expect(location).toEqual({
					x: 0.25,
					y: 0.75,
				}),
			() => {}
		);
		mockWatchLocation.mockImplementation(
			(onSuccess: (location: GPS) => void) => {
				onSuccess({
					longitude: 1,
					latitude: 1,
				});
			}
		);
		geolocation.watchLocation(
			location =>
				expect(location).toEqual({
					x: 0.5,
					y: 0.5,
				}),
			() => {}
		);
	});

	it('Calls the onError call back when theres an error', () => {
		expect.assertions(2);
		const geolocation = new Geolocation(corners);
		mockWatchLocation.mockImplementation((_, onError) => {
			onError('Failed1');
		});
		geolocation.watchLocation(
			() => {},
			error => {
				expect(error).toBe('Failed1');
			}
		);
		mockWatchLocation.mockImplementation((_, onError) => {
			onError('Failed2');
		});
		geolocation.watchLocation(
			() => {},
			error => {
				expect(error).toBe('Failed2');
			}
		);
	});
});

describe('Stop watching', () => {
	it('Called the adapter stop watching', () => {
		const geolocation = new Geolocation(corners);
		geolocation.stopWatching();
		expect(mockStopWatching).toHaveBeenCalled();
	});
});
