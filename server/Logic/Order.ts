import {OrderStatus, Location, OrderIDO} from 'api';
import {v4 as uuidv4} from 'uuid';
import {makeFail, makeGood, ResponseMsg} from '../Response';
import { IOrder } from './IOrder';

class Review {
	content: string;
	rating: number;

	constructor(cont: string, rate: number) {
		this.content = cont;
		this.rating = rate;
	}
}

export class Order extends IOrder{
	static orderList: Order[] = [];
	id: string;
	guestId: string;
	status: OrderStatus;
	items: Map<string, number>;
	creationTime: Date;
	review: Review;
	terminationTime: Date;

	override getId(): string {
		return this.id
	}
	override getGuestId(): string {
		return this.guestId
	}

	static override createOrder(id: string, items: Map<string,number>): IOrder {
		let order = new Order(id, items);
		this.orderList.push(order);
		return order;
	}

	static delegate<T, U>(
		orderId: string,
		func: (order: Order) => ResponseMsg<T, U>
	): ResponseMsg<T, U> {
		for (const element of Order.orderList) {
			if (element.id === orderId) {
				return func(element);
			}
		}
		return makeFail('No such order.', 0); //todo: status code
	}

	constructor(id: string, items: Map<string, number>) {
		super()
		this.items = items;
		this.status = 'received';
		this.id = uuidv4();
		this.guestId = id
	}

	override giveFeedback(review: string, score: number): boolean {
		throw new Error('Method not implemented')
	}

	override updateGuestLocation(_mapId: string, _location: Location): ResponseMsg<string> {return makeGood('')}

	override updateWaiterLocation(_mapId: string, _location: Location): ResponseMsg<string> {return makeGood('')}

	orderArrived(): ResponseMsg<string> {
		this.status = 'delivered';
		return makeGood('')
	}

	override getDetails(): OrderIDO {
		return {
			id: this.id, 
			guestId: this.guestId,
			items: this.items,
			status: this.status,
			creationTime: this.creationTime,
			terminationTime: this.terminationTime
		}
	}

	override changeOrderStatus(status: OrderStatus): ResponseMsg<string, string> {
		this.status = status
		return makeGood('')
	}
}
