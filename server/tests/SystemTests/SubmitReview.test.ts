import GuestInterface from '../../Interface/GuestInterface';
import ItemsInterface from '../../Interface/ItemsInterface';

import DashboardInterface from '../../Interface/DashboardInterface';
import {AppDataSource} from '../../Data/data-source';
import {getGuests} from '../../Data/Stores/GuestStore';
import reset_all from '../../Data/test_ResetDatabase';
import config from '../../config.json';

const adminID = config['admin_id'];

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
		await DashboardInterface.changeOrderStatus(
			orderID,
			'ready to deliver',
			adminID
		);
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
	await DashboardInterface.changeOrderStatus(orderID, 'received', adminID);
	const response = await GuestInterface.submitReview(
		orderID,
		'Very good service',
		5
	);
	expect(response.isSuccess()).toBeFalsy();
});

test('submit review success when order status is delivered', async () => {
	const {orderID, guestID} = await createOrder();
	await DashboardInterface.changeOrderStatus(
		orderID,
		'delivered',
		adminID
	).then(res => res.getError());
	const response = await GuestInterface.submitReview(
		orderID,
		'Very good service',
		5
	);
	expect(response.isSuccess()).toBeTruthy();
});

test('submit review should fail when rating not in range 1-5', async () => {
	const {orderID, guestID} = await createOrder();
	await DashboardInterface.changeOrderStatus(orderID, 'delivered', adminID);
	const response = await GuestInterface.submitReview(
		orderID,
		'Very good service',
		6
	);
	expect(response.isSuccess()).toBeFalsy();
});

test('submit review success for rating in range 1-5', async () => {
	const {orderID, guestID} = await createOrder();
	await DashboardInterface.changeOrderStatus(orderID, 'delivered', adminID);
	const response = await GuestInterface.submitReview(
		orderID,
		'Very good service',
		5
	);
	expect(response.isSuccess()).toBeTruthy();
});

test('get review success', async () => {
	const {orderID, guestID} = await createOrder();
	await DashboardInterface.changeOrderStatus(orderID, 'delivered', adminID);
	await GuestInterface.submitReview(orderID, 'Good service', 4);
	const response = await DashboardInterface.getReviews();
	expect(response.length).toBeGreaterThan(0);
	if (response.length === 1) {
		expect(response[0].details).toBe('Good service');
		expect(response[0].rating).toBe(4);
	}
});

test('get review for an illegal review (out of range rating) would return an empty list', async () => {
	const {orderID, guestID} = await createOrder();
	await DashboardInterface.changeOrderStatus(orderID, 'delivered', adminID);
	await GuestInterface.submitReview(orderID, 'Very good service', 6);
	const response = await DashboardInterface.getReviews();
	expect(response.length).toBe(0);
});

test('get review for an illegal review (order status is not "delivered") would return an empty list', async () => {
	const {orderID, guestID} = await createOrder({advance: false});
	await GuestInterface.submitReview(orderID, 'Very good service', 5);
	const response = await DashboardInterface.getReviews();
	expect(response.length).toBe(0);
});
