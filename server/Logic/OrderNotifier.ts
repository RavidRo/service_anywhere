import { OrderStatus, Location, OrderIDO } from "api";
import { IOrder } from "./IOrder";
import {NotificationFacade} from "./Notification/NotificationFacade";
import { Order } from "./Order";
import config from "config.json"

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

    override assign(waiterId: string): void {
        let newWaiterNotifier = new WaiterNotifier(waiterId)
        newWaiterNotifier.order = this.order
        this.order = newWaiterNotifier
    }

    override updateGuestLocation(mapId: string, location: Location): void {
        this.order.updateGuestLocation(mapId, location)
    }

    override updateWaiterLocation(mapId: string, location: Location): void {
        this.order.updateWaiterLocation(mapId, location)
    }

    override changeOrderStatus(status: OrderStatus): void {
        this.order.changeOrderStatus(status)
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
    override updateWaiterLocation(mapId: string, location: Location): void {
        notificationFacade.updateWaiterLocation(this.receiverId, this.getId(), mapId, location)  //todo: receiver ID
        this.order.updateWaiterLocation(mapId, location)
    }

    override assign(waiterId: string): void {
        super.assign(waiterId)
        notificationFacade.changeOrderStatus(this.receiverId, this.getId(), 'assigned')  //todo: receiver ID
    }
}

class DashboardNotifier extends OrderNotifier{
    override changeOrderStatus(status: OrderStatus): void {
        notificationFacade.changeOrderStatus(this.receiverId, this.getId(), status)  //todo: receiver ID
        this.order.changeOrderStatus(status)
    }

    override cancelOrderGuest(guestId: string): void {
        this.order.cancelOrderGuest(guestId)    //todo: change to return bool and if fail don't notify
        notificationFacade.changeOrderStatus(this.receiverId, this.getId(), 'canceled')  //todo: receiver ID
    }
}

class WaiterNotifier extends OrderNotifier{
    override updateGuestLocation(mapId: string, location: Location): void {
        notificationFacade.updateGuestLocation(this.receiverId, this.getId(), mapId, location)   //todo: receiver ID
        this.order.updateGuestLocation(mapId, location)
    }

    override assign(waiterId: string): void {
        if(waiterId !== this.receiverId){
            super.assign(waiterId)
        }
        notificationFacade.assignedToOrder(waiterId, this.getDetails())
        this.order.assign(waiterId)
    }
}