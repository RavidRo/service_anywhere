import {makePromise as mockMakePromise} from '../PromiseUtils';
import Requests from 'guests_app/src/Networking/requests';
import ItemViewModel from 'guests_app/src/ViewModel/ItemViewModel';
import {ItemIDO} from 'guests_app/src/types';

const items: ItemIDO[] = [
	{id: '1', name: 'Beer', price: 10, preparationTime: 1},
	{id: '2', name: 'Bamba', price: 5, preparationTime: 1},
];

beforeAll(() => {
	jest.spyOn(Requests.prototype, 'getItems').mockImplementation(() =>
		mockMakePromise(items)
	);
});

afterAll(() => {
	jest.restoreAllMocks();
});

describe('Constructor', () => {
	test('The class can be created successfully', async () => {
		const requests = new Requests();
		const itemViewModel = new ItemViewModel(requests);
		expect(itemViewModel).toBeTruthy();
	});

	test('Initializing items', async () => {
		const requests = new Requests();
		const itemViewModel = new ItemViewModel(requests);
		await itemViewModel.syncItems();
		expect(
			itemViewModel.getItems() !== null &&
				itemViewModel.getItems().length === 2
		).toBeTruthy();
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
