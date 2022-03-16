import { OrderIDO } from "api";
import { Status } from "../Status";

function newOrder(receiverId: string, order: OrderIDO){
    throw new Error('Method not implemented')
}

function updateGuestLocation(receiverId: string, orderId: string, mapId: string, location: Location){
    throw new Error('Method not implemented')
}

function updateWaiterLocation(receiverId: string, orderId: string, mapId: string, location: Location){
    throw new Error('Method not implemented')
}

function changeOrderStatus(receiverId: string, orderId: string, status: Status){
    throw new Error('Method not implemented')
}

export default{
    newOrder,
    updateGuestLocation,
    updateWaiterLocation,
    changeOrderStatus
}