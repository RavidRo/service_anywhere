import {getGuests} from '../../Data/Stores/GuestStore';
import {AppDataSource} from '../../Data/data-source';
import reset_all from '../../Data/test_ResetDatabase';
import DashboardInterface from '../../Interface/DashboardInterface';
import GuestInterface from '../../Interface/GuestInterface';
import ItemsInterface from '../../Interface/ItemsInterface';
import config from '../../config.json'

const adminID = config['admin_id']


beforeAll(async () => {
	jest.spyOn(console, 'error').mockImplementation(jest.fn());
	await AppDataSource.initialize();
});

beforeEach(async () => {
	await reset_all();
});

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

test('Assigns a free waiter successfully', async () => {
	const waitersIDs = await DashboardInterface.getWaiters();
	const {orderID} = await createOrder();
	const assignResponse = await DashboardInterface.assignWaiter(
		[orderID],
		waitersIDs.getData()[0].id
	);
	expect(assignResponse.isSuccess()).toBeTruthy();
});

test("Order's status is changed when first assigned", async () => {
	const waitersIDs = await DashboardInterface.getWaiters();
	const {orderID, guestID} = await createOrder();
	await DashboardInterface.assignWaiter([orderID], waitersIDs.getData()[0].id);
	const orderResponse = await GuestInterface.getGuestOrder(guestID);
	expect(orderResponse.getData().status).toBe('assigned');
});

test('Assigning a busy waiter to an order results with a failure', async () => {
	const waitersIDs = await DashboardInterface.getWaiters();
	const {orderID: orderID1} = await createOrder({index: 0});
	const {orderID: orderID2} = await createOrder({index: 1});

	await DashboardInterface.assignWaiter([orderID1], waitersIDs.getData()[0].id);

	const assignResponse2 = await DashboardInterface.assignWaiter(
		[orderID2],
		waitersIDs.getData()[0].id
	);

	expect(assignResponse2.isSuccess()).toBeFalsy();
});

test('Getting the assigned waiters successfully', async () => {
	const waitersIDs = (await DashboardInterface.getWaiters()).getData();
	const {orderID: orderID1} = await createOrder({index: 0});
	const {orderID: orderID2} = await createOrder({index: 1});

	await DashboardInterface.assignWaiter([orderID1, orderID2], waitersIDs[0].id);
	await DashboardInterface.assignWaiter([orderID2], waitersIDs[1].id);

	const assignedResponse = await DashboardInterface.getWaiterByOrder(
		orderID2
	);
	expect(new Set(assignedResponse.getData())).toEqual(
		new Set([waitersIDs[0].id, waitersIDs[1].id])
	);
});

test('Getting waiters of none existed order results with failure', async () => {
	const assignedResponse = await DashboardInterface.getWaiterByOrder(
		'random id'
	);
	expect(assignedResponse.isSuccess()).toBeFalsy();
});
