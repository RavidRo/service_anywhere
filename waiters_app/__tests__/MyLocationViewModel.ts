const myLocation = {x: 14, y: 12};
const mockWatchLocation = jest
	.fn()
	.mockImplementation((setLocation: (location: Location) => void) => {
		setLocation(myLocation);
	});
jest.mock('waiters_app/src/localization/Geolocation', () => {
	return jest.fn().mockImplementation(() => {
		return {
			watchLocation: mockWatchLocation,
		};
	});
});

const mockLocation = jest.fn();
jest.mock('waiters_app/src/Models/MyLocationModel', () => {
	return jest.fn().mockImplementation(() => {
		return {
			location: mockLocation,
		};
	});
});

import MyLocationModel from 'waiters_app/src/Models/MyLocationModel';
import Geolocation from 'waiters_app/src/localization/Geolocation';
import MyLocationViewModel from 'waiters_app/src/ViewModel/MyLocationViewModel';

beforeEach(() => {
	(MyLocationModel as unknown as jest.Mock).mockClear();
	(Geolocation as unknown as jest.Mock).mockClear();

	jest.useFakeTimers('legacy');
});

afterEach(() => {
	jest.clearAllTimers();
	jest.useRealTimers();
});

describe('Constructor', () => {
	it('Starting to check current location', () => {
		const _myLocation = new MyLocationViewModel();
		expect(mockWatchLocation).toHaveBeenCalled();
	});

	it('Starting to update location according to changes', () => {
		const myLocationViewModel = new MyLocationViewModel();
		expect(myLocationViewModel.location).toEqual(myLocation);
	});
});
