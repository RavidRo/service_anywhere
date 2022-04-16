import {OrderStatus, Location, OrderIDO} from 'api';
import {OrderDAO} from '../Data/entities/Domain/OrderDAO';
import * as OrderStore from '../Data/Stores/OrderStore';
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

export class Order implements IOrder {
	private orderDAO: OrderDAO;

	private constructor(orderDAO: OrderDAO) {
		this.orderDAO = orderDAO;
	}

	static async createNewOrder(
		guestID: string,
		items: Map<string, number>
	): Promise<ResponseMsg<IOrder>> {
		const orderResponse = await OrderStore.saveOrder(guestID, items);
		return orderResponse.ifGood(order => this.createOrder(order));
	}

	static createOrder(orderDAO: OrderDAO): IOrder {
		return new Order(orderDAO);
	}

	getID(): string {
		return this.orderDAO.id;
	}

	getGuestId(): string {
		return this.orderDAO.guest.id;
	}

	getDetails(): OrderIDO {
		const items: [string, number][] = this.orderDAO.orderToItems.map(
			orderToItem => [orderToItem.item.id, orderToItem.quantity]
		);
		return {
			id: this.orderDAO.id,
			guestId: this.orderDAO.guest.id,
			items: new Map(items),
			status: this.orderDAO.status,
			creationTime: new Date(this.orderDAO.creationTime),
			completionTime: this.orderDAO.completionTime
				? new Date(this.orderDAO.completionTime)
				: undefined,
		};
	}

	isActive(): boolean {
		return !['canceled', 'delivered'].includes(this.orderDAO.status);
	}

	canAssign(): boolean {
		return ['ready to deliver', 'assigned', 'on the way'].includes(
			this.orderDAO.status
		);
	}

	updateGuestLocation(
		_mapId: string,
		_location: Location
	): ResponseMsg<void> {
		return makeGood();
	}

	updateWaiterLocation(
		_mapId: string,
		_location: Location
	): ResponseMsg<void> {
		return makeGood();
	}

	async orderArrived(): Promise<ResponseMsg<void>> {
		this.orderDAO.status = 'delivered';
		this.orderDAO.completionTime = Date.now();
		await this.orderDAO.save();
		return makeGood();
	}

	async cancelOrder(): Promise<ResponseMsg<void>> {
		this.orderDAO.status = 'canceled';
		this.orderDAO.completionTime = Date.now();
		await this.orderDAO.save();
		return makeGood();
	}

	async changeOrderStatus(status: OrderStatus): Promise<ResponseMsg<void>> {
		this.orderDAO.status = status;
		if (status === 'canceled' || status === 'delivered') {
			this.orderDAO.completionTime = Date.now();
		}
		await this.orderDAO.save();
		return makeGood();
	}

	async assign(_waiterId: string): Promise<ResponseMsg<void>> {
		if (!this.canAssign()) {
			return makeFail(
				'Can only assign waiters to orders that are ready to deliver',
				400
			);
		}
		this.orderDAO.status = 'assigned';
		await this.orderDAO.save();
		return makeGood();
	}

	giveFeedback(_review: string, _score: number): boolean {
		throw new Error('Method not implemented');
	}
}
