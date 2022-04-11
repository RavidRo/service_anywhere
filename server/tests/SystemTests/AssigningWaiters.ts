import {OrderIDO} from 'api';
import DashboardInterface from 'server/Interface/DashboardInterface';
import GuestInterface from 'server/Interface/GuestInterface';
import ItemsInterface from 'server/Interface/ItemsInterface';

import {ResponseMsg} from 'server/Response';

const createOrder = () => {
	const itemsList = ItemsInterface.getItems();
	const guestID = 'random id';
	const items = new Map([[itemsList[0].id, 5]]);

	const createOrderResponse = GuestInterface.createOrder(guestID, items);
	const orderID = createOrderResponse.getData();
	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');

	return {orderID: createOrderResponse.getData(), guestID};
};

test('Assigns a free waiter successfully', () => {
	const waitersIDs = DashboardInterface.getWaiters();
	const {orderID} = createOrder();
	const assignResponse = DashboardInterface.assignWaiter(
		[orderID],
		waitersIDs[0]
	);
	expect(assignResponse.isSuccess()).toBeTruthy();
});

test("Order's status is changed when first assigned", () => {
	const waitersIDs = DashboardInterface.getWaiters();
	const {orderID, guestID} = createOrder();
	DashboardInterface.assignWaiter([orderID], waitersIDs[0]);
	const orderResponse = GuestInterface.getGuestOrder(
		guestID
	) as any as ResponseMsg<OrderIDO>;
	expect(orderResponse.getData().status).toBe('assigned');
});

test('Assigning a busy waiter to an order results with a failure', () => {
	const waitersIDs = DashboardInterface.getWaiters();
	const {orderID: orderID1} = createOrder();
	const {orderID: orderID2} = createOrder();

	DashboardInterface.assignWaiter([orderID1], waitersIDs[0]);

	const assignResponse2 = DashboardInterface.assignWaiter(
		[orderID2],
		waitersIDs[0]
	) as any as ResponseMsg<void>;

	expect(assignResponse2.isSuccess()).toBeFalsy();
});

test('Getting the assigned waiters successfully', () => {
	const waitersIDs = DashboardInterface.getWaiters();
	const {orderID: orderID1} = createOrder();
	const {orderID: orderID2} = createOrder();

	DashboardInterface.assignWaiter([orderID1, orderID2], waitersIDs[0]);
	DashboardInterface.assignWaiter([orderID2], waitersIDs[1]);

	const assignedResponse = DashboardInterface.getWaiterByOrder(
		orderID2
	) as any as ResponseMsg<string[]>;
	expect(assignedResponse.getData()).toContain([
		waitersIDs[0],
		waitersIDs[1],
	]);
});

test('Getting waiters of none existed order results with failure', () => {
	const assignedResponse = DashboardInterface.getWaiterByOrder(
		'random id'
	) as any as ResponseMsg<string[]>;
	expect(assignedResponse.isSuccess()).toBeFalsy();
});
