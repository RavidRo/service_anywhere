import GuestInterface from '../../Interface/GuestInterface';
import ItemsInterface from '../../Interface/ItemsInterface';

import DashboardInterface from '../../Interface/DashboardInterface';
import {AppDataSource} from '../../Data/data-source';
import {getGuests} from '../../Data/Stores/GuestStore';
import reset_all from '../../Data/test_ResetDatabase';
import config from '../../config.json'

const adminID = config['admin_id']

const createOrder = async ({index = 0, advance = true} = {}) => {
	const guests = await getGuests();
	const guestID = guests[index].id;
	const itemsList = await ItemsInterface.getItems();
	const items = new Map([[itemsList[0].id, 5]]);

	const createOrderResponse = await GuestInterface.createOrder(
		guestID,
		items
	);
	const orderID = createOrderResponse.getData();
	if (advance) {
		await DashboardInterface.changeOrderStatus(orderID, 'ready to deliver', adminID);
	}

	return {orderID, guestID, items};
};

beforeAll(async () => {
	jest.spyOn(console, 'error').mockImplementation(jest.fn());
	await AppDataSource.initialize();
});

beforeEach(async () => {
	await reset_all();
});

test('submit review should fail when order status isnt delivered', async () => {
	const {orderID, guestID} = await createOrder();
	DashboardInterface.changeOrderStatus(orderID, 'on the way', adminID);
	const response = await GuestInterface.submitReview(
		orderID,
		'Very good service',
		5
	);
	expect(response.isSuccess()).toBeFalsy();
});

test('submit review success when order status is delivered', async () => {
	const {orderID, guestID} = await createOrder();
	DashboardInterface.changeOrderStatus(orderID, 'delivered', adminID);
	const response = await GuestInterface.submitReview(
		orderID,
		'Very good service',
		5
	);
	expect(response.isSuccess()).toBeTruthy();
});

test('submit review should fail when rating not in range 1-5', async () => {
	const {orderID, guestID} = await createOrder();
	DashboardInterface.changeOrderStatus(orderID, 'on the way', adminID);
	const response = await GuestInterface.submitReview(
		orderID,
		'Very good service',
		6
	);
	expect(response.isSuccess()).toBeFalsy();
});

test('submit review success for rating in range 1-5', async () => {
	const {orderID, guestID} = await createOrder();
	DashboardInterface.changeOrderStatus(orderID, 'delivered', adminID);
	const response = await GuestInterface.submitReview(
		orderID,
		'Very good service',
		5
	);
	expect(response.isSuccess()).toBeTruthy();
});
