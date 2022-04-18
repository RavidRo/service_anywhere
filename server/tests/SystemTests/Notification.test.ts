/*
 1) create order 
 2) choose waiter and store its id
 3) add subscriber with waiter id +  func = jest.fn 
 4) assign waiter 
 5) expect func = has been called
*/



import {getGuests} from '../../Data/Stores/GuestStore';
import {AppDataSource} from '../../Data/data-source';
import reset_all from '../../Data/test_ResetDatabase';
import GuestInterface from '../../Interface/GuestInterface';
import ItemsInterface from '../../Interface/ItemsInterface';
import DashboardInterface from '../../Interface/DashboardInterface';
import { Notifier } from '../../Logic/Notification/Notifier';
import WaiterInterface from '../../Interface/WaiterInterface';

beforeAll(async () => {
	await AppDataSource.initialize();
});

beforeEach(async () => {
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
    const waiterID = waitersIDs.getData()[0]
    const notifier = Notifier.getInstance();
    const func = jest.fn();
    notifier.addSubscriber(waiterID, func)
    await DashboardInterface.assignWaiter([orderResponse.getData().id],waiterID)
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

	await GuestInterface.createOrder(guestID, items);
	const orderResponse = await GuestInterface.getGuestOrder(guestID);
    const waiterID = waitersIDs.getData()[0]
    const notifier = Notifier.getInstance();
    const func = jest.fn();
    notifier.addSubscriber(waiterID, func);
    await DashboardInterface.assignWaiter([orderResponse.getData().id],waiterID)
    await GuestInterface.updateLocationGuest(guestID,"1", {x:0.5, y:0.5}) 
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

	await GuestInterface.createOrder(guestID, items);
	const orderResponse = await GuestInterface.getGuestOrder(guestID);
    const notifier = Notifier.getInstance();
    notifier.clearSubscribers();
    const func = jest.fn();
    notifier.addSubscriber(guestID, func);
    await DashboardInterface.changeOrderStatus(orderResponse.getData().id,'in preparation')
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
    notifier.clearSubscribers();
    const func = jest.fn(()=>{console.log("guest changeOrderStatus notification"); return true });
    notifier.addSubscriber(guestID, func);
    await DashboardInterface.changeOrderStatus(orderResponse.getData().id,'in preparation')
    await DashboardInterface.changeOrderStatus(orderResponse.getData().id, 'received')
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

	await GuestInterface.createOrder(guestID, items);
	const orderResponse = await GuestInterface.getGuestOrder(guestID);
    const waiterID = waitersIDs.getData()[0]
    await DashboardInterface.assignWaiter([orderResponse.getData().id],waiterID)
    const notifier = Notifier.getInstance();
    notifier.clearSubscribers();
    const func = jest.fn(()=>{console.log("guest updateWaiterLocation notification"); return true });
    notifier.addSubscriber(guestID, func);
    await WaiterInterface.updateLocationWaiter(waiterID,"1",{x:0.5,y:0.5})
    expect(func).toHaveBeenCalledTimes(1);

});

