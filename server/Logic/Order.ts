import {Status} from './Status';
import {v4 as uuidv4} from 'uuid';
import {Location} from '../../api';
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
	status: Status;
	items: Map<string, number>;
	creationTime: Date;
	review: Review;
	terminationTime: Date;

	override getId(): string {
		return this.id
	}

	static createOrder(items: Map<string,number>): string {
		let order = new Order(items);
		this.orderList.push(order);
		return order.id;
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

	static getGuestLocation(orderID: string): ResponseMsg<Location> {
		for (const element of Order.orderList) {
			if (element.id === orderID) {
				console.log(`get location: ${element.guestLocation}`);
				return makeGood(element.guestLocation);
			}
		}
		return makeFail('No such order.', 0); //todo: status code
	}

	constructor(id: string, items: Map<string, number>) {
		super()
		this.items = items;
		this.status = Status.RECEIVED;
		this.id = uuidv4();
		this.guestId = id
	}

	giveFeedback(content: string, rating: number): ResponseMsg<void> {
		this.review = new Review(content, rating);
		return makeGood();
	}

	updateLocationGuest(location: Location): ResponseMsg<void> {
		this.guestLocation = location;
		console.log(`update: ${location}`);
		return makeGood();
	}

	hasOrderArrived(): ResponseMsg<boolean> {
		return makeGood(this.status === Status.DELIVERED);
	}

	orderArrived(): void {
		this.status = Status.DELIVERED;
	}
}
