import {OrderStatus, Location, OrderIDO} from 'api';
import {ResponseMsg} from '../Response';

export interface IOrder {
	getID(): string;
	getGuestId(): string;
	getDetails(): OrderIDO;

	isActive(): boolean;
	canAssign(): boolean;

	updateWaiterLocation(location: Location): ResponseMsg<void>;
	updateGuestLocation(location: Location): ResponseMsg<void>;

	assign(waiterId: string[]): Promise<ResponseMsg<void>>;
	changeOrderStatus(
		status: OrderStatus,
		assigningWaiter: boolean,
		adminPrivileges: boolean
	): Promise<ResponseMsg<void>>;

	giveFeedback(review: string, score: number): boolean;
}
