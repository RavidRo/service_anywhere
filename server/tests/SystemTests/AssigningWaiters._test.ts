import {OrderIDO} from 'api';
import DashboardInterface from 'server/Interface/DashboardInterface';
import GuestInterface from 'server/Interface/GuestInterface';
import ItemsInterface from 'server/Interface/ItemsInterface';

import {ResponseMsg} from 'server/Response';

const createOrder = async () => {
	const itemsList = await ItemsInterface.getItems();
	const guestID = 'random id';
	const items = new Map([[itemsList[0].id, 5]]);

	const createOrderResponse = GuestInterface.createOrder(guestID, items);
	const orderIDResponse = await createOrderResponse;
	const orderID = orderIDResponse.getData();
	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');

	return {orderID, guestID};
};

test('Assigns a free waiter successfully', async () => {
	const waitersIDs = DashboardInterface.getWaiters();
	const {orderID} = await createOrder();
	const assignResponse = DashboardInterface.assignWaiter(
		[orderID],
		waitersIDs.getData()[0]
	);
	expect(assignResponse.isSuccess()).toBeTruthy();
});

test("Order's status is changed when first assigned", async () => {
	const waitersIDs = DashboardInterface.getWaiters();
	const {orderID, guestID} = await createOrder();
	DashboardInterface.assignWaiter([orderID], waitersIDs.getData()[0]);
	const orderResponse = GuestInterface.getGuestOrder(
		guestID
	) as any as ResponseMsg<OrderIDO>;
	expect(orderResponse.getData().status).toBe('assigned');
});

test('Assigning a busy waiter to an order results with a failure', async () => {
	const waitersIDs = DashboardInterface.getWaiters();
	const {orderID: orderID1} = await createOrder();
	const {orderID: orderID2} = await createOrder();

	DashboardInterface.assignWaiter([orderID1], waitersIDs.getData()[0]);

	const assignResponse2 = DashboardInterface.assignWaiter(
		[orderID2],
		waitersIDs.getData()[0]
	) as any as ResponseMsg<void>;

	expect(assignResponse2.isSuccess()).toBeFalsy();
});

test('Getting the assigned waiters successfully', async () => {
	const waitersIDs = DashboardInterface.getWaiters();
	const {orderID: orderID1} = await createOrder();
	const {orderID: orderID2} = await createOrder();

	DashboardInterface.assignWaiter(
		[orderID1, orderID2],
		waitersIDs.getData()[0]
	);
	DashboardInterface.assignWaiter([orderID2], waitersIDs.getData()[1]);

	const assignedResponse = DashboardInterface.getWaiterByOrder(
		orderID2
	) as any as ResponseMsg<string[]>;
	expect(assignedResponse.getData()).toContain([
		waitersIDs.getData()[0],
		waitersIDs.getData()[1],
	]);
});

test('Getting waiters of none existed order results with failure', () => {
	const assignedResponse = DashboardInterface.getWaiterByOrder(
		'random id'
	) as any as ResponseMsg<string[]>;
	expect(assignedResponse.isSuccess()).toBeFalsy();
});
