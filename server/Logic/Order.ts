import {OrderStatus, Location, OrderIDO} from 'api';
import {v4 as uuidv4} from 'uuid';
import {makeFail, makeGood, ResponseMsg} from '../Response';
import {IOrder} from './IOrder';

class Review {
	content: string;
	rating: number;

	constructor(cont: string, rate: number) {
		this.content = cont;
		this.rating = rate;
	}
}

export class Order extends IOrder {
	id: string;
	guestId: string;
	status: OrderStatus;
	items: Map<string, number>;
	creationTime: Date;
	review: Review;
	terminationTime: Date;

	override getId(): string {
		return this.id;
	}
	override getGuestId(): string {
		return this.guestId;
	}

	static override createOrder(
		id: string,
		items: Map<string, number>
	): IOrder {
		let order = new Order(id, items);
		IOrder.orderList.push(order);
		return order;
	}

	constructor(id: string, items: Map<string, number>) {
		super();
		this.items = items;
		this.status = 'received';
		this.id = uuidv4();
		this.guestId = id;
		this.creationTime = new Date();
	}

	override giveFeedback(_review: string, _score: number): boolean {
		throw new Error('Method not implemented');
	}

	override updateGuestLocation(
		_mapId: string,
		_location: Location
	): ResponseMsg<void> {
		return makeGood();
	}

	override updateWaiterLocation(
		_mapId: string,
		_location: Location
	): ResponseMsg<void> {
		return makeGood();
	}

	override orderArrived(): ResponseMsg<void> {
		this.status = 'delivered';
		this.terminationTime = new Date();
		return makeGood();
	}

	override getDetails(): OrderIDO {
		return {
			id: this.id,
			guestId: this.guestId,
			items: this.items,
			status: this.status,
			creationTime: this.creationTime,
			terminationTime: this.terminationTime,
		};
	}

	override cancelOrder(): void {
		this.status = 'canceled';
		this.terminationTime = new Date();
	}

	override changeOrderStatus(status: OrderStatus): ResponseMsg<void> {
		this.status = status;
		if (status === 'canceled' || status === 'delivered') {
			this.terminationTime = new Date();
		}
		if(status !== 'assigned' && status !== 'on the way'){
			//todo: call waiterOrder.unassignWaiter() but actually do that in the interfaces because Order does not know WaiterOrder
		}
		return makeGood();
	}

	override isActive(): boolean {
		return !['canceled', 'delivered'].includes(this.status);
	}

	canAssign(): boolean {
		return this.status in ['ready to deliver', 'assigned', 'on the way']
	}

	assign(_waiterId: string): ResponseMsg<void> {
		if (!this.canAssign()) {
			return makeFail(
				'Can only assign waiters to orders that are ready to deliver',
				400
			);
		}
		this.status = 'assigned';
		return makeGood();
	}
}
