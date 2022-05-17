import {getGuests} from '../../Data/Stores/GuestStore';
import {AppDataSource} from '../../Data/data-source';
import reset_all from '../../Data/test_ResetDatabase';
import GuestInterface from '../../Interface/GuestInterface';
import ItemsInterface from '../../Interface/ItemsInterface';
import DashboardInterface from '../../Interface/DashboardInterface';
import {Notifier} from '../../Logic/Notification/Notifier';
import WaiterInterface from '../../Interface/WaiterInterface';
import config from '../../config.json'

const adminID = config['admin_id']

function timeout(time: number) {
	return new Promise<void>(resolve => {
		setTimeout(() => resolve(), time);
	});
}

beforeAll(async () => {
	jest.spyOn(console, 'error').mockImplementation(jest.fn());
	await AppDataSource.initialize();
});

beforeEach(async () => {
	Notifier.getInstance().clearSubscribers();
	await reset_all();
});

test('Notified waiter on assignedToOrder', async () => {
	const guests = await getGuests();
	const guestID = guests[0].id;
	const itemsList = await ItemsInterface.getItems();
	const waitersIDs = await DashboardInterface.getWaiters();
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	await GuestInterface.createOrder(guestID, items);
	const orderResponse = await GuestInterface.getGuestOrder(guestID);
	const waiterID = waitersIDs.getData()[0].id;
	const notifier = Notifier.getInstance();
	const func = jest.fn().mockReturnValue(true);
	notifier.addSubscriber(waiterID, func);
	await DashboardInterface.assignWaiter(
		[orderResponse.getData().id],
		waiterID
	);
	await timeout(200);
	expect(func).toHaveBeenCalledTimes(1);
});

test('Notified waiter on updateGuestLocation', async () => {
	const guests = await getGuests();
	const guestID = guests[0].id;
	const itemsList = await ItemsInterface.getItems();
	const waitersIDs = await DashboardInterface.getWaiters();
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	const orderID = (
		await GuestInterface.createOrder(guestID, items)
	).getData();
	const waiterID = waitersIDs.getData()[0].id;

	const notifier = Notifier.getInstance();
	const func = jest.fn().mockReturnValue(true);
	notifier.addSubscriber(waiterID, func);
	// console.log('Waiter ID', waiterID);
	// console.log('Guest ID', waiterID);
	await DashboardInterface.assignWaiter([orderID], waiterID);
	GuestInterface.updateLocationGuest(guestID, {x: 0.5, y: 0.5, mapID: '1'});
	await timeout(200);
	expect(func).toHaveBeenCalledTimes(2);
});

test('Notified guest on changeOrderStatus', async () => {
	const guests = await getGuests();
	const guestID = guests[0].id;
	const itemsList = await ItemsInterface.getItems();
	const waitersIDs = await DashboardInterface.getWaiters();
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	const orderID = (
		await GuestInterface.createOrder(guestID, items)
	).getData();

	const notifier = Notifier.getInstance();
	const func = jest.fn().mockReturnValue(true);
	notifier.addSubscriber(guestID, func);

	await DashboardInterface.changeOrderStatus(orderID, 'in preparation', adminID);
	await timeout(200);
	expect(func).toHaveBeenCalledTimes(1);
});

test('Notified guest on changeOrderStatus 2 times', async () => {
	const guests = await getGuests();
	const guestID = guests[0].id;
	const itemsList = await ItemsInterface.getItems();
	const waitersIDs = await DashboardInterface.getWaiters();
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	await GuestInterface.createOrder(guestID, items);
	const orderResponse = await GuestInterface.getGuestOrder(guestID);
	const notifier = Notifier.getInstance();
	const func = jest.fn().mockReturnValue(true);
	notifier.addSubscriber(guestID, func);
	await DashboardInterface.changeOrderStatus(
		orderResponse.getData().id,
		'in preparation',
		adminID
	);
	await DashboardInterface.changeOrderStatus(
		orderResponse.getData().id,
		'received',
		adminID
	);
	await timeout(200);
	expect(func).toHaveBeenCalledTimes(2);
});

test('Notified guest on updateWaiterLocation', async () => {
	const guests = await getGuests();
	const guestID = guests[0].id;
	const itemsList = await ItemsInterface.getItems();
	const waitersIDs = await DashboardInterface.getWaiters();
	const items = new Map([
		[itemsList[0].id, 5],
		[itemsList[1].id, 0],
	]);

	const orderResponse = await GuestInterface.createOrder(guestID, items);
	const waiterID = waitersIDs.getData()[0].id;
	await DashboardInterface.assignWaiter([orderResponse.getData()], waiterID);
	const notifier = Notifier.getInstance();
	const func = jest.fn();
	await timeout(200);
	notifier.addSubscriber(guestID, func);
	await WaiterInterface.updateLocationWaiter(waiterID, {x: 0.5, y: 0.5, mapID: '1'});
	await timeout(200);
	expect(func).toHaveBeenCalledTimes(1);
});
