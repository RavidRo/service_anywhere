import { IOrder } from "./IOrder";
import NotificationFacade from "./Notification/NotificationFacade";
import { Order } from "./Order";

export abstract class OrderNotifier extends IOrder{
    order: IOrder

    static override createOrder(id: string, items: Map<string, number>): IOrder {
        var newOrder = new GuestNotifier()
        var newOrderOrder = new DashboardNotifier()
        newOrderOrder.order = new Order(id, items)
        newOrder.order = newOrderOrder
        NotificationFacade.newOrder('', {
            id: id,
            items: items, guestId: '',
            status: 'received',
            creationTime: new Date(),
            terminationTime: undefined
        })   //todo: receiverId? guestId creationTime
        return newOrder
    }

    override getId(): string {
        return this.order.getId()
    }
}

class GuestNotifier extends OrderNotifier{
    override updateWaiterLocation(mapId: string, location: Location): void {
        NotificationFacade.updateWaiterLocation()
        this.order.updateWaiterLocation(mapId, location)
    }
}

class DashboardNotifier extends OrderNotifier{

}

class WaiterNotifier extends OrderNotifier{
    override updateGuestLocation(mapId: string, location: Location): void {
        NotificationFacade.updateGuestLocation()
        this.order.updateGuestLocation(mapId, location)
    }
}