import { OrderStatus, OrderIDO } from "api";

function newOrder(receiverId: string, order: OrderIDO){
    throw new Error('Method not implemented')
}

function updateGuestLocation(receiverId: string, orderId: string, mapId: string, location: Location){
    throw new Error('Method not implemented')
}

function updateWaiterLocation(receiverId: string, orderId: string, mapId: string, location: Location){
    throw new Error('Method not implemented')
}

function changeOrderStatus(receiverId: string, orderId: string, status: OrderStatus){
    throw new Error('Method not implemented')
}

function assignWaiter(){
    throw new Error('method bad')
}

export default{
    newOrder,
    updateGuestLocation,
    updateWaiterLocation,
    changeOrderStatus,
    assignWaiter
}