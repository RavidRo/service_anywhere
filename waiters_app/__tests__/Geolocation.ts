import Geolocation from 'waiters_app/src/localization/Geolocation';
import {GPS} from 'waiters_app/src/map';

// const mockSetOrders = jest.fn();
// const mockSetGuestLocation = jest.fn();
jest.mock('../src/localization/GeolocationAdapter', () => {
	return jest.fn().mockImplementation(() => {
		return {
			watchLocation: () => {},
			stopWatching: () => {},
			getLocation: (onSuccess: (location: GPS) => void) => {
				onSuccess({
					longitude: 0,
					latitude: 0,
				});
			},
		};
	});
});
import GeolocationAdapter from 'waiters_app/src/localization/GeolocationAdapter';

// import Requests from '../src/networking/Requests';
// import OrderModel from '../src/Models/OrderModel';
// import {Location, OrderIdo} from 'waiters_app/src/ido';

beforeEach(() => {
	(GeolocationAdapter as unknown as jest.Mock).mockClear();

	// jest.useFakeTimers('legacy');
});

// afterEach(() => {
// 	jest.clearAllTimers();
// 	jest.useRealTimers();
// });

const corners = {
	bottomLeftGPS: 0,
	bottomRightGPS: 0,
	topLeftGPS: 0,
	topRightGPS: 0,
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
});
