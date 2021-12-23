import {OrderID, WaiterID} from '../api'
import {Order} from '../Logic/Order'
import { WaiterOrder } from '../Logic/WaiterOrder';

function getOrders(): Order[]{
    return Order.orderList;
}

function assignWaiter(orderID: OrderID, waiterID: WaiterID): void{
    WaiterOrder.assignWaiter(orderID, waiterID)
}

function getWaiters(): WaiterID[]{
    return WaiterOrder.waiterList
}

function getWaiterByOrder(orderID: OrderID): WaiterID[]{
    return WaiterOrder.getWaiterByOrder(orderID);
}

export default {
    getOrders,
    assignWaiter,
    getWaiters,
    getWaiterByOrder
}
