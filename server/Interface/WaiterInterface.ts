import {Location, OrderID, WaiterID} from '../api'
import { Order } from '../Logic/Order'
import { WaiterOrder } from '../Logic/WaiterOrder'

function getWaiterOrder(waiterID: WaiterID): Order[]{
    let orderIds = WaiterOrder.getWaiterOrder(waiterID);
    // let orders: Order[] = []
    // for(const element of Order.orderList){
    //     console.log(`element: ${element}`)
    //     console.log(element.id in orderIds)
    //     if(element.id in orderIds){
    //         orders.push(element)
    //     }
    // }
    return Order.orderList.filter(order => orderIds.includes(order.id))
}

function getGuestLocation(orderID: OrderID): Location{
    return Order.getGuestLocation(orderID)
}

function orderArrived(orderID: OrderID): void{
    Order.delegate(orderID, (order: Order) => {order.orderArrived(); return true})
}

function connectWaiter(): string{
    return WaiterOrder.connectWaiter()
}

export default {
    getWaiterOrder,
    getGuestLocation,
    orderArrived,
    connectWaiter
}