import { OrderStatus } from "api";
import { IOrder } from "./IOrder";
import NotificationFacade from "./Notification/NotificationFacade";
import { Order } from "./Order";

export abstract class OrderNotifier extends IOrder{
    order: IOrder
    receiverId: string

    static override createOrder(guestId: string, items: Map<string, number>): IOrder {
        let newOrder = new GuestNotifier(guestId)
        let newOrderOrder = new DashboardNotifier() //todo: how to get receiver ID
        newOrderOrder.order = new Order(guestId, items)
        newOrder.order = newOrderOrder
        NotificationFacade.newOrder(guestId, {
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
}

class GuestNotifier extends OrderNotifier{
    override updateWaiterLocation(mapId: string, location: Location): void {
        NotificationFacade.updateWaiterLocation(this.receiverId, this.getId(), mapId, location)  //todo: receiver ID
        this.order.updateWaiterLocation(mapId, location)
    }

    override assign(waiterId: string): void {
        super.assign(waiterId)
        NotificationFacade.changeOrderStatus(this.receiverId, this.getId(), 'assigned')  //todo: receiver ID
    }
}

class DashboardNotifier extends OrderNotifier{
    override changeOrderStatus(status: OrderStatus): void {
        NotificationFacade.changeOrderStatus(this.receiverId, this.getId(), status)  //todo: receiver ID
        this.order.changeOrderStatus(status)
    }

    override cancelOrderGuest(guestId: string): void {
        this.order.cancelOrderGuest(guestId)    //todo: change to return bool and if fail don't notify
        NotificationFacade.changeOrderStatus(this.receiverId, this.getId(), 'canceled')  //todo: receiver ID
    }
}

class WaiterNotifier extends OrderNotifier{
    override updateGuestLocation(mapId: string, location: Location): void {
        NotificationFacade.updateGuestLocation(this.receiverId, this.getId(), mapId, location)   //todo: receiver ID
        this.order.updateGuestLocation(mapId, location)
    }

    override assign(waiterId: string): void {
        if(waiterId !== this.receiverId){
            super.assign(waiterId)
        }
        NotificationFacade.assignWaiter()   //todo: match that
        this.order.assign(waiterId)
    }
}