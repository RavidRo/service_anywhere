import {Order, OrderID, WaiterID} from '../api'

function getOrders(): Order[]{
    var ret: Order[] = []
    return ret
    //return dashboard.getOrders()
}

function assignWaiter(orderID: OrderID, waiterID: WaiterID): void{
    //dashboard.assignWaiter(orderID, waiterID)
}

function getWaiters(): WaiterID[]{
    var ret: WaiterID[] = []
    return ret
    //return dashboard.getWaiters()
}

function getWaiterByOrder(orderID: OrderID): WaiterID{
    var ret: WaiterID = ''
    return ret
    //return dashboard.getWaiterByOrder(orderID)
}

export default {
    getOrders,
    assignWaiter,
    getWaiters,
    getWaiterByOrder
}
