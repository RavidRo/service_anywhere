import DashboardInterface from 'server/Interface/DashboardInterface';
import GuestInterface from 'server/Interface/GuestInterface';
import ItemsInterface from 'server/Interface/ItemsInterface';
import WaiterInterface from 'server/Interface/WaiterInterface';

const createOrder = () => {
	const itemsList = ItemsInterface.getItems();
	const guestID = 'random id';
	const items = new Map([[itemsList[0].id, 5]]);

	const createOrderResponse = GuestInterface.createOrder(guestID, items);
	const orderID = createOrderResponse.getData();
	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');

	return {orderID: createOrderResponse.getData(), guestID};
};

// type OrderStatus =
// 	| 'received'
// 	| 'in preparation'
// 	| 'ready to deliver'
// 	| 'assigned'
// 	| 'on the way'
// 	| 'delivered'
// 	| 'canceled';

test('Forwarding status to in preparation successfully', () => {
	const {orderID, guestID} = createOrder();
	DashboardInterface.changeOrderStatus(orderID, 'in preparation');
	const orderResponse = GuestInterface.getGuestOrder(guestID);
	expect(orderResponse.getData().status).toBe('in preparation');
});

test('Forwarding status to ready to deliver successfully', () => {
	const {orderID, guestID} = createOrder();
	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');
	const orderResponse = GuestInterface.getGuestOrder(guestID);
	expect(orderResponse.getData().status).toBe('ready to deliver');
});

test('Forwarding status to assigned without assigning fail', () => {
	const {orderID, guestID} = createOrder();
	const changeResponse = DashboardInterface.changeOrderStatus(
		orderID,
		'assigned'
	);
	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(changeResponse.isSuccess()).toBeFalsy();
	expect(orderResponse.getData().status).toBe('received');
});

test('Assigning a waiter results in failure if order is not ready', () => {
	const {orderID, guestID} = createOrder();
	const waiterIds = DashboardInterface.getWaiters();
	const changeResponse = DashboardInterface.assignWaiter(
		[orderID],
		waiterIds[0]
	);
	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(changeResponse.isSuccess()).toBeFalsy();
	expect(orderResponse.getData().status).toBe('received');
});

test("Assigning a waiter results in changes the order's status to assigned", () => {
	const {orderID, guestID} = createOrder();
	const waiterIds = DashboardInterface.getWaiters();
	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');
	DashboardInterface.assignWaiter([orderID], waiterIds[0]);
	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().status).toBe('assigned');
});

test("Assigning another waiter to the same order does not change it's status", () => {
	const {orderID, guestID} = createOrder();
	const waiterIds = DashboardInterface.getWaiters();
	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');
	DashboardInterface.assignWaiter([orderID], waiterIds[0]);
	const assignedResponse = DashboardInterface.assignWaiter(
		[orderID],
		waiterIds[1]
	);
	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(assignedResponse.isSuccess()).toBeTruthy();
	expect(orderResponse.getData().status).toBe('assigned');
});

test('Status changes successfully when waiter is on the way with the order', () => {
	const {orderID, guestID} = createOrder();
	const waiterIds = DashboardInterface.getWaiters();
	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');
	DashboardInterface.assignWaiter([orderID], waiterIds[0]);
	const orderOnTheWayResponse = WaiterInterface.orderOnTheWay(orderID);
	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(orderOnTheWayResponse.isSuccess()).toBeTruthy();
	expect(orderResponse.getData().status).toBe('on the way');
});

test("Waiters can be assigned to an order when it's on the way", () => {
	const {orderID, guestID} = createOrder();
	const waiterIds = DashboardInterface.getWaiters();

	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');
	DashboardInterface.assignWaiter([orderID], waiterIds[0]);
	WaiterInterface.orderOnTheWay(orderID);

	const assignResponse = DashboardInterface.assignWaiter(
		[orderID],
		waiterIds[1]
	);
	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(assignResponse.isSuccess()).toBeTruthy();
	expect(orderResponse.getData().status).toBe('on the way');
});

test("Arriving order's status is changed", () => {
	const {orderID, guestID} = createOrder();
	const waiterIds = DashboardInterface.getWaiters();

	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');
	DashboardInterface.assignWaiter([orderID], waiterIds[0]);
	DashboardInterface.assignWaiter([orderID], waiterIds[1]);
	WaiterInterface.orderOnTheWay(orderID);
	WaiterInterface.orderArrived(orderID);
	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().status).toBe('delivered');
});

test("Order's status can be changed to 'delivered' with out getting assigned first", () => {
	const {orderID, guestID} = createOrder();

	DashboardInterface.changeOrderStatus(orderID, 'delivered');
	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().status).toBe('delivered');
});
test("Order's status can be changed to 'on the way' by the dashboard's change status function", () => {
	const {orderID, guestID} = createOrder();
	const waiterIds = DashboardInterface.getWaiters();

	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');
	DashboardInterface.assignWaiter([orderID], waiterIds[0]);
	DashboardInterface.assignWaiter([orderID], waiterIds[1]);
	DashboardInterface.changeOrderStatus(orderID, 'on the way');

	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().status).toBe('on the way');
});
test("Order's status can't be changed by waiters to delivered with out changing the status to 'on the way'", () => {
	const {orderID, guestID} = createOrder();
	const waiterIds = DashboardInterface.getWaiters();

	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');
	DashboardInterface.assignWaiter([orderID], waiterIds[0]);
	DashboardInterface.assignWaiter([orderID], waiterIds[1]);
	const arrivedResponse = WaiterInterface.orderArrived(orderID);
	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(arrivedResponse.isSuccess()).toBeFalsy();
	expect(orderResponse.getData().status).toBe('assigned');
});
test("Forwarding status to 'on the way' with out assigning results in failure", () => {
	const {orderID, guestID} = createOrder();

	DashboardInterface.changeOrderStatus(orderID, 'ready to deliver');
	const changeStatusResponse = DashboardInterface.changeOrderStatus(
		orderID,
		'on the way'
	);

	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(changeStatusResponse.isSuccess()).toBeFalsy();
	expect(orderResponse.getData().status).toBe('ready to deliver');
});
test("Status can be changed to 'delivered' when unassigned", () => {
	const {orderID, guestID} = createOrder();

	const changeStatusResponse = DashboardInterface.changeOrderStatus(
		orderID,
		'delivered'
	);

	const orderResponse = GuestInterface.getGuestOrder(guestID);

	expect(changeStatusResponse.isSuccess()).toBeTruthy();
	expect(orderResponse.getData().status).toBe('delivered');
});
test("Waiters can't set status of orders they are not assigned to to 'on the way'", () => {
	expect(false).toBeTruthy();
});
test("Waiters can't set status of orders they are not assigned to to 'delivered'", () => {
	expect(false).toBeTruthy();
});
test('');
