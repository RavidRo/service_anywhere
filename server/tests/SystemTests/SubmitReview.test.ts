import {IOrder} from '../../Logic/IOrder';
import {WaiterOrder} from '../../Logic/WaiterOrder';
import GuestInterface from '../../Interface/GuestInterface';
import ItemsInterface from '../../Interface/ItemsInterface';
import {test_resetWaiters} from '../../Data/WaiterStore';
import {test_resetItems} from '../../Data/ItemStore';
import DashboardInterface from 'server/Interface/DashboardInterface';

beforeEach(() => {
	IOrder.test_deleteAllOrders();
	WaiterOrder.getInstance().test_deleteAll();
	test_resetWaiters();
	test_resetItems();
});



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

const guestID = 'guestID';


test('submit review should fail when order status isnt delivered', async () => {
	const {orderID, guestID} = await createOrder();
    DashboardInterface.changeOrderStatus(orderID, 'on the way');
    const response = await GuestInterface.submitReview(orderID,"Very good service", 5)
	expect(response.isSuccess()).toBeFalsy();

});

test('submit review success when order status is delivered', async () => {
	const {orderID, guestID} = await createOrder();
    DashboardInterface.changeOrderStatus(orderID, 'delivered');
    const response = await GuestInterface.submitReview(orderID,"Very good service", 5)
	expect(response.isSuccess()).toBeTruthy();

});

test('submit review should fail when rating not in range 1-5', async () => {
	const {orderID, guestID} = await createOrder();
    DashboardInterface.changeOrderStatus(orderID, 'on the way');
    const response = await GuestInterface.submitReview(orderID,"Very good service", 6)
	expect(response.isSuccess()).toBeFalsy();

});

test('submit review success for rating in range 1-5', async () => {
	const {orderID, guestID} = await createOrder();
    DashboardInterface.changeOrderStatus(orderID, 'delivered');
    const response = await GuestInterface.submitReview(orderID,"Very good service", 5)
	expect(response.isSuccess()).toBeTruthy();

});
