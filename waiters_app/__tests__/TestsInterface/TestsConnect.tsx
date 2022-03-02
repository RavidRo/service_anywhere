import React from 'react';
import {Button, TextInput} from 'react-native';
import TestRenderer, {act} from 'react-test-renderer';
import {makePromise} from 'waiters_app/PromiseUtils';

import ConnectController from 'waiters_app/src/components/Controllers/ConnectController';

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

const mockGetWaiterOrders = jest.fn().mockImplementation(() => makePromise([]));
const mockGetItems = jest.fn().mockImplementation(() => makePromise([]));
const mockLogin = jest.fn().mockImplementation(() => 'token');
jest.mock('waiters_app/src/networking/Requests', () => {
	console.log(mockLogin);
	return jest.fn().mockImplementation(() => {
		return {
			getWaiterOrders: mockGetWaiterOrders,
			getItems: mockGetItems,
			login: mockLogin,
		};
	});
});
import Requests from 'waiters_app/src/networking/Requests';

beforeEach(() => {
	(Requests as unknown as jest.Mock).mockClear();
});

describe('Page loads', () => {
	it('Loads an input and a submit button', () => {
		const testRenderer = TestRenderer.create(<ConnectController />);
		expect(testRenderer.root.findByType(TextInput)).toBeTruthy();
		expect(testRenderer.root.findByType(Button)).toBeTruthy();
	});

	it('Loads an input and a submit button dsadsa', async () => {
		const testRenderer = TestRenderer.create(<ConnectController />);
		const button = testRenderer.root.findByType(Button);
		await act(async () => {
			button.props.onPress();
		});
		// console.log(testRenderer.toJSON());
		expect(testRenderer?.root.findByType(TextInput)).toBeTruthy();
	});
});
