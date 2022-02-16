import {Location, OrderIdo, OrderStatus} from '../ido';

export default class Order {
	public readonly id: string;
	public readonly guestID: string;
	public readonly items: Record<string, number>;
	public orderStatus: OrderStatus;
	public location?: Location;

	constructor(order: OrderIdo) {
		this.id = order.id;
		this.items = order.items;
		this.orderStatus = order.status;
		this.guestID = order.guestID;
	}
}
