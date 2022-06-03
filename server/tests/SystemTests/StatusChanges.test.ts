import {AppDataSource} from '../../Data/data-source';
import {getGuests} from '../../Data/Stores/GuestStore';
import reset_all from '../../Data/test_ResetDatabase';
import DashboardInterface from '../../Interface/DashboardInterface';
import GuestInterface from '../../Interface/GuestInterface';
import ItemsInterface from '../../Interface/ItemsInterface';
import WaiterInterface from '../../Interface/WaiterInterface';
import config from '../../config.json';

const adminID = config['admin_id'];

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
		await DashboardInterface.changeOrderStatus(
			orderID,
			'ready to deliver',
			adminID
		);
	}

	return {orderID, guestID, items};
};

// type OrderStatus =
// 	| 'received'
// 	| 'in preparation'
// 	| 'ready to deliver'
// 	| 'assigned'
// 	| 'on the way'
// 	| 'delivered'
// 	| 'canceled';

test('Forwarding status to in preparation successfully', async () => {
	const {orderID, guestID} = await createOrder();
	await DashboardInterface.changeOrderStatus(
		orderID,
		'in preparation',
		adminID
	);
	const orderResponse = await GuestInterface.getGuestOrder(guestID);
	expect(orderResponse.getData().status).toBe('in preparation');
});

test('Forwarding status to ready to deliver successfully', async () => {
	const {orderID, guestID} = await createOrder();
	await DashboardInterface.changeOrderStatus(
		orderID,
		'ready to deliver',
		adminID
	);
	const orderResponse = await GuestInterface.getGuestOrder(guestID);
	expect(orderResponse.getData().status).toBe('ready to deliver');
});

test('Forwarding status to assigned without assigning fail', async () => {
	const {orderID, guestID} = await createOrder();
	const changeResponse = await DashboardInterface.changeOrderStatus(
		orderID,
		'assigned',
		adminID
	);
	const orderResponse = await GuestInterface.getGuestOrder(guestID);

	expect(changeResponse.isSuccess()).toBeFalsy();
	expect(orderResponse.getData().status).toBe('ready to deliver');
});

test('Assigning a waiter succeeded even if order is not ready', async () => {
	const {orderID, guestID} = await createOrder();
	const waiterIds = await DashboardInterface.getWaiters();
	const changeResponse = await DashboardInterface.assignWaiter(orderID, [
		waiterIds.getData()[0].id,
	]);
	const orderResponse = await GuestInterface.getGuestOrder(guestID);

	expect(changeResponse.isSuccess()).toBeTruthy();
	expect(orderResponse.getData().status).toBe('assigned');
});

test("Assigning a waiter results in changes the order's status to assigned", async () => {
	const {orderID, guestID} = await createOrder();
	const waiterIds = await DashboardInterface.getWaiters();
	await DashboardInterface.changeOrderStatus(
		orderID,
		'ready to deliver',
		adminID
	);
	await DashboardInterface.assignWaiter(orderID, [waiterIds.getData()[0].id]);
	const orderResponse = await GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().status).toBe('assigned');
});

test("Assigning another waiter to the same order does not change it's status", async () => {
	const {orderID, guestID} = await createOrder();
	const waiterIds = await DashboardInterface.getWaiters();
	await DashboardInterface.changeOrderStatus(
		orderID,
		'ready to deliver',
		adminID
	);
	await DashboardInterface.assignWaiter(orderID, [waiterIds.getData()[0].id]);
	const assignedResponse = await DashboardInterface.assignWaiter(orderID, [
		waiterIds.getData()[1].id,
	]);
	const orderResponse = await GuestInterface.getGuestOrder(guestID);

	expect(assignedResponse.isSuccess()).toBeTruthy();
	expect(orderResponse.getData().status).toBe('assigned');
});

test('Status changes successfully when waiter is on the way with the order', async () => {
	const {orderID, guestID} = await createOrder();
	const waiterIds = await DashboardInterface.getWaiters();
	await DashboardInterface.changeOrderStatus(
		orderID,
		'ready to deliver',
		adminID
	);
	await DashboardInterface.assignWaiter(orderID, [waiterIds.getData()[0].id]);
	const orderOnTheWayResponse = await WaiterInterface.orderOnTheWay(
		orderID,
		waiterIds.getData()[0].id
	);
	const orderResponse = await GuestInterface.getGuestOrder(guestID);

	expect(orderOnTheWayResponse.isSuccess()).toBeTruthy();
	expect(orderResponse.getData().status).toBe('on the way');
});

test("Waiters can be assigned to an order when it's on the way", async () => {
	const {orderID, guestID} = await createOrder();
	const waiterIds = await DashboardInterface.getWaiters();

	await DashboardInterface.changeOrderStatus(
		orderID,
		'ready to deliver',
		adminID
	);
	await DashboardInterface.assignWaiter(orderID, [waiterIds.getData()[0].id]);
	await WaiterInterface.orderOnTheWay(orderID, waiterIds.getData()[0].id);

	const assignResponse = await DashboardInterface.assignWaiter(orderID, [
		waiterIds.getData()[1].id,
	]);
	const orderResponse = await GuestInterface.getGuestOrder(guestID);

	expect(assignResponse.isSuccess()).toBeTruthy();
	expect(orderResponse.getData().status).toBe('on the way');
});

test("Arriving order's status is changed to delivered", async () => {
	const {orderID, guestID} = await createOrder();
	const waiterIds = await DashboardInterface.getWaiters();

	await DashboardInterface.changeOrderStatus(
		orderID,
		'ready to deliver',
		adminID
	);
	await DashboardInterface.assignWaiter(orderID, [waiterIds.getData()[0].id]);
	await DashboardInterface.assignWaiter(orderID, [waiterIds.getData()[1].id]);
	await WaiterInterface.orderOnTheWay(orderID, waiterIds.getData()[0].id);
	await WaiterInterface.orderArrived(orderID, waiterIds.getData()[0].id);

	const orders = (await DashboardInterface.getAllOrders()).getData();
	const myOrders = orders.filter(order => order.id === orderID);

	expect(myOrders).toHaveLength(1);
	expect(myOrders[0].status).toBe('delivered');
});

test("Order's status can be changed to 'delivered' with out getting assigned first", async () => {
	const {orderID, guestID} = await createOrder();

	await DashboardInterface.changeOrderStatus(orderID, 'delivered', adminID);
	const orders = await DashboardInterface.getAllOrders();
	const order = orders.getData().filter(order => order.id === orderID)[0];
	expect(order).toBeTruthy();
	expect(order.status).toBe('delivered');
});
test("Order's status can be changed to 'on the way' by the dashboard's change status function", async () => {
	const {orderID, guestID} = await createOrder();
	const waiterIds = await DashboardInterface.getWaiters();

	await DashboardInterface.changeOrderStatus(
		orderID,
		'ready to deliver',
		adminID
	);
	await DashboardInterface.assignWaiter(orderID, [waiterIds.getData()[0].id]);
	await DashboardInterface.assignWaiter(orderID, [waiterIds.getData()[1].id]);
	await DashboardInterface.changeOrderStatus(orderID, 'on the way', adminID);

	const orderResponse = await GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.getData().status).toBe('on the way');
});
test("Forwarding status to 'on the way' with out assigning results in failure", async () => {
	const {orderID, guestID} = await createOrder();

	await DashboardInterface.changeOrderStatus(
		orderID,
		'ready to deliver',
		adminID
	);
	const changeStatusResponse = await DashboardInterface.changeOrderStatus(
		orderID,
		'on the way',
		adminID
	);

	const orderResponse = await GuestInterface.getGuestOrder(guestID);

	expect(changeStatusResponse.isSuccess()).toBeFalsy();
	expect(orderResponse.getData().status).toBe('ready to deliver');
});
test("Status can be changed to 'delivered' when unassigned", async () => {
	const {orderID} = await createOrder();

	const changeStatusResponse = await DashboardInterface.changeOrderStatus(
		orderID,
		'delivered',
		adminID
	);
	const orders = await DashboardInterface.getAllOrders();
	const order = orders.getData().filter(order => order.id === orderID)[0];
	expect(order).toBeTruthy();
	expect(changeStatusResponse.isSuccess()).toBeTruthy();
	expect(order.status).toBe('delivered');
});

test("Guests can't get their none active orders", async () => {
	const {orderID, guestID} = await createOrder();

	await DashboardInterface.changeOrderStatus(orderID, 'delivered', adminID);

	const orderResponse = await GuestInterface.getGuestOrder(guestID);

	expect(orderResponse.isSuccess()).toBeFalsy();
});
test.todo(
	"Waiters can't set status of orders they are not assigned to to 'on the way'"
);
test.todo(
	"Waiters can't set status of orders they are not assigned to to 'delivered'"
);
