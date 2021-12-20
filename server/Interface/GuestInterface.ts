import {Api, Arrived, Location, OrderID} from '../api'

function createOrder(): OrderID{
    var ret: OrderID = ''
    return ret
    //return guest.createOrder()
}

function updateLocationGuest(location: Location, orderID: OrderID): void{
    //guest.updateLocationGuest(location, orderID)
}

function hasOrderArrived(orderID: OrderID): Arrived{
    var ret: Arrived = true
    return ret
    //return guest.hasOrderArrived()
}

export default {
    createOrder,
    updateLocationGuest,
    hasOrderArrived
}