import config from '../../config.json';
import {AppDataSource} from '../../Data/data-source';
import {getGuests} from '../../Data/Stores/GuestStore';
import reset_all from '../../Data/test_ResetDatabase';
import DashboardInterface from '../../Interface/DashboardInterface';
import GuestInterface from '../../Interface/GuestInterface';
import ItemsInterface from '../../Interface/ItemsInterface';

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

test('Cancel order by guest should fail when order status is not received', async () => {
	const {orderID, guestID} = await createOrder();
	const response = await GuestInterface.cancelOrder(orderID, guestID);
	expect(response.isSuccess()).toBeFalsy();
});

test('Cancel order by guest success for order status received', async () => {
	const {orderID, guestID} = await createOrder({advance: false});
	const response = await GuestInterface.cancelOrder(orderID, guestID);
	expect(response.isSuccess()).toBeTruthy();
});
