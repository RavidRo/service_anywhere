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


test('cancel order by guest should fail when order status isnt received', async () => {
	const {orderID, guestID} = await createOrder();
    DashboardInterface.changeOrderStatus(orderID, 'in preparation');
    const response = await GuestInterface.cancelOrder(orderID)
	expect(response.isSuccess()).toBeFalsy();

});

test('cancal order by guest sucess for order status received', async () => {
	const {orderID, guestID} = await createOrder();
    const response = await GuestInterface.cancelOrder(orderID)
	expect(response.isSuccess()).toBeTruthy();

});

