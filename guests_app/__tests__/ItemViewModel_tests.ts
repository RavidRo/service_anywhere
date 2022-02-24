import {Item} from 'guests_app/src/types';
import {
	makePromise as mockMakePromise,
} from '../PromiseUtils';
import Requests from 'guests_app/src/Networking/requests';
import { ItemsViewModel } from 'guests_app/src/ViewModel/ItemViewModel';

const items: Item[] = [{'id': '1',  'name': "Beer", 'prepare_time': 1}, {'id': '2',  'name': "Bamba", 'prepare_time': 1}]

beforeAll(() => {
    jest.spyOn(Requests.prototype, 'getItems').mockImplementation(() => mockMakePromise(items));
});

afterAll(() => {
    jest.restoreAllMocks();
});

describe('Constructor', () => {
	test('The class can be created successfully', async () => {
		const requests = new Requests();
		const itemViewModel = new ItemsViewModel(requests);
		expect(itemViewModel).toBeTruthy();
	});

	test('Looked for orders in the server', async () => {
		const requests = new Requests();
		const itemViewModel = new ItemsViewModel(requests);
		expect(requests.getItems).toHaveBeenCalled();
	});

	test('Initializing order to the order in the server', async () => {
		const requests = new Requests();
		const itemViewModel = new ItemsViewModel(requests);
		expect(itemViewModel.getItems() != null)
	});
});



// const mockGetMyOrders = jest
// 	.fn()
// 	.mockImplementation(() => mockMakePromise(order1));

// const requestsMock = jest.mock('../src/networking/Requests', () => {
// 	return jest.fn().mockImplementation(() => {
// 		return {
// 			getMyOrders: () => mockGetMyOrders

// 			// getGuestLocation: () =>
// 			// 	mockMakePromise<Location>(mockGuestLocation),
// 			// orderArrived: () => {},
// 			// login: () => mockMakePromise('id'),
// 		};
// 	});
// });