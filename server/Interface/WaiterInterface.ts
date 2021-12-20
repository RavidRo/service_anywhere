import {Location, Order, OrderID, WaiterID} from '../api'

function getWaiterOrder(waiterID: WaiterID): Order[]{
    var ret: Order[] = []
    return ret
    //return waiter.getWaiterOrder(waiterID)
}

function getGuestLocation(orderID: OrderID): Location{
    var ret: Location = {x: 0, y: 0}
    return ret
    //return waiter.getGuestLocation(orderID)
}

function orderArrived(orderID: OrderID): void{
    //waiter.orderArrived(orderID)
}

export default {
    getWaiterOrder,
    getGuestLocation,
    orderArrived
}