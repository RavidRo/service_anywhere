import { OrderStatus, Location, OrderIDO } from "api";
import { IOrder } from "./IOrder";
import {NotificationFacade} from "./Notification/NotificationFacade";
import { Order } from "./Order";
import config from "config.json"
import { ResponseMsg } from "server/Response";

const notificationFacade: NotificationFacade = new NotificationFacade()

export abstract class OrderNotifier extends IOrder{
    order: IOrder
    receiverId: string

    static override createOrder(guestId: string, items: Map<string, number>): IOrder {
        let newOrder = new GuestNotifier(guestId)
        let newOrderOrder = new DashboardNotifier(config.admin_id)
        newOrderOrder.order = new Order(guestId, items)
        newOrder.order = newOrderOrder
        notificationFacade.newOrder(guestId, {
            id: newOrder.getId(),
            items: items, guestId: guestId,
            status: 'received',
            creationTime: new Date(),
            terminationTime: undefined
        })
        return newOrder
    }

    constructor(receiverId: string){
        super()
        this.receiverId = receiverId
    }

    override getId(): string {
        return this.order.getId()
    }

    override getGuestId(): string {
        return this.order.getGuestId()
    }

    override assign(waiterId: string): ResponseMsg<string> {
        let newWaiterNotifier = new WaiterNotifier(waiterId)
        newWaiterNotifier.order = this.order
        this.order = newWaiterNotifier
        notificationFacade.assignedToOrder(waiterId, this.getDetails())
        return this.changeOrderStatus('assigned')
    }

    override updateGuestLocation(mapId: string, location: Location): ResponseMsg<string> {
        return this.order.updateGuestLocation(mapId, location)
    }

    override updateWaiterLocation(mapId: string, location: Location): ResponseMsg<string> {
        return this.order.updateWaiterLocation(mapId, location)
    }

    override changeOrderStatus(status: OrderStatus): ResponseMsg<string> {
        return this.order.changeOrderStatus(status)
    }

    override cancelOrderGuest(guestId: string): void {
        this.order.cancelOrderGuest(guestId)
    }

    override cancelOrderManager(): boolean {
        return this.order.cancelOrderManager()
    }

    override giveFeedback(review: string, score: number): boolean {
        return this.order.giveFeedback(review, score)
    }

    override getDetails(): OrderIDO {
        return this.order.getDetails()
    }
}

class GuestNotifier extends OrderNotifier{
    override updateWaiterLocation(mapId: string, location: Location): ResponseMsg<string> {
        notificationFacade.updateWaiterLocation(this.receiverId, this.getId(), mapId, location)  //todo: receiver ID
        return this.order.updateWaiterLocation(mapId, location)
    }
}

class DashboardNotifier extends OrderNotifier{
    override changeOrderStatus(status: OrderStatus): ResponseMsg<string> {
        notificationFacade.changeOrderStatus(this.receiverId, this.getId(), status)  //todo: receiver ID
        return this.order.changeOrderStatus(status)
    }

    override cancelOrderGuest(guestId: string): void {
        this.order.cancelOrderGuest(guestId)    //todo: change to return bool and if fail don't notify
        notificationFacade.changeOrderStatus(this.receiverId, this.getId(), 'canceled')  //todo: receiver ID
    }
}

class WaiterNotifier extends OrderNotifier{
    override updateGuestLocation(mapId: string, location: Location): ResponseMsg<string> {
        notificationFacade.updateGuestLocation(this.receiverId, this.getId(), mapId, location)   //todo: receiver ID
        return this.order.updateGuestLocation(mapId, location)
    }
}