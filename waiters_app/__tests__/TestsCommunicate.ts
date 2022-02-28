import Communicate from 'waiters_app/src/communication/Communicate';
import {Location} from 'waiters_app/src/ido';

const mockSend = jest.fn();
jest.mock('waiters_app/src/communication/ConnectionHandler', () => {
	return jest.fn().mockImplementation(() => {
		return {
			send: mockSend,
		};
	});
});

import ConnectionHandler from 'waiters_app/src/communication/ConnectionHandler';

beforeEach(() => {
	(ConnectionHandler as unknown as jest.Mock).mockClear();
	mockSend.mockClear();
});

const location: Location = {
	x: 12.5,
	y: -29.12,
};
describe('Sending notifications successfully', () => {
	it('updateWaiterLocation', () => {
		const communicate = new Communicate();
		communicate.updateWaiterLocation(location);
		expect(mockSend).toBeCalledWith('updateWaiterLocation', location);
	});
});
