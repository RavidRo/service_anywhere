import {OrderStatus as OrderStatusName, Location, OrderIDO} from 'api';
import {makeFail, makeGood, ResponseMsg} from '../Response';

import {OrderDAO} from '../Data/entities/Domain/OrderDAO';
import * as OrderStore from '../Data/Stores/OrderStore';

import {IOrder} from './IOrder';
import {OrderStatus} from './OrderStatus';

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
		return this.orderDAO.getDetails();
	}

	isActive(): boolean {
		return !OrderStatus.makeStatus(this.orderDAO.status).isEndStatus();
	}

	canAssign(): boolean {
		const futureNewStatusName =
			this.orderDAO.status === 'on the way'
				? this.orderDAO.status
				: 'assigned';
		const futureNewStatus = OrderStatus.makeStatus(futureNewStatusName);
		return OrderStatus.makeStatus(this.orderDAO.status)
			.to(futureNewStatus, true, true)
			.isSuccess();
	}

	updateGuestLocation(_location: Location): ResponseMsg<void> {
		return makeGood();
	}

	updateWaiterLocation(_location: Location): ResponseMsg<void> {
		return makeGood();
	}

	async changeOrderStatus(
		newStatusName: OrderStatusName,
		assigningWaiter: boolean,
		adminPrivileges: boolean
	): Promise<ResponseMsg<void>> {
		const newStatus = OrderStatus.makeStatus(newStatusName);
		const currentStatus = OrderStatus.makeStatus(this.orderDAO.status);
		const toResponse = currentStatus.to(
			newStatus,
			assigningWaiter,
			adminPrivileges
		);
		if (!toResponse.isSuccess()) {
			return toResponse;
		}

		this.orderDAO.status = newStatusName;
		if (newStatus.isEndStatus()) {
			this.orderDAO.completionTime = Date.now();
		}
		await this.orderDAO.save();

		return makeGood();
	}

	async assign(_waiterId: string): Promise<ResponseMsg<void>> {
		return this.changeOrderStatus('assigned', true, true);
	}

	giveFeedback(_review: string, _score: number): boolean {
		throw new Error('Method not implemented');
	}
}
