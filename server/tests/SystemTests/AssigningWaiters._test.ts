import DashboardInterface from '../../Interface/DashboardInterface';
import GuestInterface from '../../Interface/GuestInterface';
import ItemsInterface from '../../Interface/ItemsInterface';
import {IOrder} from '../../Logic/IOrder';
import {WaiterOrder} from '../../Logic/WaiterOrder';
// import {test_resetWaiters} from '../../Data/Stores/WaiterStore';
// import {test_resetItems} from '../../Data/Stores/ItemStore';

const waiterOrder = WaiterOrder.getInstance();

beforeEach(() => {
	// IOrder.test_deleteAllOrders();
	// waiterOrder.test_deleteAll();
	// test_resetWaiters();
	// test_resetItems();
});

const createOrder = async (unique: string = '') => {
	const itemsList = await ItemsInterface.getItems();
	const guestID = 'random id' + unique;
	const items = new Map([[itemsList[0].id, 5]]);

	const createOrderResponse = await GuestInterface.createOrder(
		guestID,
		items
	);
	const orderID = createOrderResponse.getData();
	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');

	return {orderID, guestID};
};

test('Assigns a free waiter successfully', async () => {
	const waitersIDs = await DashboardInterface.getWaiters();
	const {orderID} = await createOrder();
	const assignResponse = await DashboardInterface.assignWaiter(
		[orderID],
		waitersIDs.getData()[0]
	);
	expect(assignResponse.isSuccess()).toBeTruthy();
});

test("Order's status is changed when first assigned", async () => {
	const waitersIDs = await DashboardInterface.getWaiters();
	const {orderID, guestID} = await createOrder();
	await DashboardInterface.assignWaiter([orderID], waitersIDs.getData()[0]);
	const orderResponse = GuestInterface.getGuestOrder(guestID);
	expect(orderResponse.getData().status).toBe('assigned');
});

test('Assigning a busy waiter to an order results with a failure', async () => {
	const waitersIDs = await DashboardInterface.getWaiters();
	const {orderID: orderID1} = await createOrder('1');
	const {orderID: orderID2} = await createOrder('2');

	await DashboardInterface.assignWaiter([orderID1], waitersIDs.getData()[0]);

	const assignResponse2 = await DashboardInterface.assignWaiter(
		[orderID2],
		waitersIDs.getData()[0]
	);

	expect(assignResponse2.isSuccess()).toBeFalsy();
});

test('Getting the assigned waiters successfully', async () => {
	const waitersIDs = (await DashboardInterface.getWaiters()).getData();
	const {orderID: orderID1} = await createOrder('0');
	const {orderID: orderID2} = await createOrder('1');

	await DashboardInterface.assignWaiter([orderID1, orderID2], waitersIDs[0]);
	await DashboardInterface.assignWaiter([orderID2], waitersIDs[1]);

	const assignedResponse = await DashboardInterface.getWaiterByOrder(
		orderID2
	);
	expect(assignedResponse.getData()).toEqual([waitersIDs[0], waitersIDs[1]]);
});

test('Getting waiters of none existed order results with failure', async () => {
	const assignedResponse = await DashboardInterface.getWaiterByOrder(
		'random id'
	);
	expect(assignedResponse.isSuccess()).toBeFalsy();
});
