import {makePromise as mockMakePromise} from 'waiters_app/PromiseUtils';

jest.mock('waiters_app/src/localization/GeolocationAdapter', () =>
	jest.fn().mockImplementation(() => {
		return {
			watchLocation: jest.fn(),
			stopWatching: jest.fn(),
			getLocation: jest.fn(),
		};
	})
);
jest.mock('waiters_app/src/networking/Requests', () =>
	jest.fn().mockImplementation(() => {
		return {
			getWaiterOrders: () => mockMakePromise([]),
			getItems: () => mockMakePromise([]),
			login: jest.fn().mockImplementation(() => mockMakePromise('token')),
		};
	})
);

import GeolocationAdapter from 'waiters_app/src/localization/GeolocationAdapter';
import Requests from 'waiters_app/src/networking/Requests';

import React from 'react';
import {Button, TextInput} from 'react-native';
import TestRenderer, {act} from 'react-test-renderer';

import ConnectController from 'waiters_app/src/components/Controllers/ConnectController';

beforeEach(() => {
	(Requests as unknown as jest.Mock).mockClear();
	(GeolocationAdapter as unknown as jest.Mock).mockClear();
	// const requests = new Requests();
	// (requests.login as unknown as jest.Mock).mockImplementation(() => 'token');
});

describe('Page loads', () => {
	it('Loads an input and a submit button', () => {
		const testRenderer = TestRenderer.create(<ConnectController />);
		expect(testRenderer.root.findByType(TextInput)).toBeTruthy();
		expect(testRenderer.root.findByType(Button)).toBeTruthy();
	});

	// it("Wrong password", () => {

	// });

	it('Wrong password', async () => {
		const testRenderer = TestRenderer.create(<ConnectController />);
		const button = testRenderer.root.findByType(Button);
		await act(async () => {
			button.props.onPress();
		});
		expect(testRenderer?.root.findByType(TextInput)).toBeTruthy();
	});
});
