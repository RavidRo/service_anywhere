import {
	makeFail,
	makePromise as mockMakePromise,
	timeout,
} from 'waiters_app/PromiseUtils';
import React from 'react';

import {fireEvent, render, waitFor} from '@testing-library/react-native';

// https://stackoverflow.com/questions/59587799/how-to-resolve-animated-usenativedriver-is-not-supported-because-the-native
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('waiters_app/src/communication/ConnectionHandler', () => {
	return jest.fn().mockImplementation(() => {
		return {
			connect: jest
				.fn()
				.mockImplementation((_token, onSuccess, _onError) => {
					setTimeout(() => {
						onSuccess();
					}, 500);
				}),
		};
	});
});

jest.mock('waiters_app/src/localization/GeolocationAdapter', () =>
	jest.fn().mockImplementation(() => {
		return {
			watchLocation: jest.fn(),
			stopWatching: jest.fn(),
			getLocation: jest.fn(),
		};
	})
);

import GeolocationAdapter from 'waiters_app/src/localization/GeolocationAdapter';
import Requests from 'waiters_app/src/networking/Requests';
import ConnectionHandler from 'waiters_app/src/communication/ConnectionHandler';

import ConnectController from 'waiters_app/src/components/Controllers/ConnectController';
import ConnectionModel from 'waiters_app/src/Models/ConnectionModel';

const mockedRequests = {
	login: jest.spyOn(Requests.prototype, 'login'),
	items: jest.spyOn(Requests.prototype, 'getItems'),
	orders: jest.spyOn(Requests.prototype, 'getWaiterOrders'),
};
function mockDefaultImplementation() {
	mockedRequests.login.mockImplementation(() => mockMakePromise('token'));
	mockedRequests.items.mockImplementation(() => mockMakePromise([]));
	mockedRequests.orders.mockImplementation(() => mockMakePromise([]));
}

jest.setTimeout(10000);

beforeEach(() => {
	(GeolocationAdapter as unknown as jest.Mock).mockClear();
	(ConnectionHandler as unknown as jest.Mock).mockClear();

	ConnectionModel.getInstance().isReconnecting = false;
	ConnectionModel.getInstance().token = undefined;

	mockDefaultImplementation();
});

test('Loads an input and a submit button', async () => {
	const {getByTestId, queryByTestId} = render(<ConnectController />);

	expect(getByTestId('passwordInput')).toBeTruthy();
	expect(getByTestId('submit')).toBeTruthy();
	expect(queryByTestId('loading')).toBeFalsy();
});

test('Wrong password', async () => {
	mockedRequests.login.mockImplementation(() => makeFail());

	const {getByTestId, queryByTestId} = render(<ConnectController />);
	const button = getByTestId('submit');
	fireEvent.press(button);

	await waitFor(async () => {
		expect(queryByTestId('passwordInput')).toBeTruthy();
		expect(queryByTestId('submit')).toBeTruthy();
		expect(queryByTestId('loading')).toBeFalsy();
	});
});

test('Shows a loading indicator before results are fetched', async () => {
	const {getByTestId, queryByTestId} = render(<ConnectController />);

	const button = getByTestId('submit');
	fireEvent.press(button);

	await waitFor(() => expect(queryByTestId('loading')).toBeTruthy());
});

test('Shows home page after connecting successfully', async () => {
	const {getByTestId, queryByTestId} = render(<ConnectController />);

	const button = getByTestId('submit');
	fireEvent.press(button);

	await waitFor(async () => {
		expect(queryByTestId('homeScreen')).toBeTruthy();
	});
});
