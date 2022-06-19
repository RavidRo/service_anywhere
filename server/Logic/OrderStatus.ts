import {OrderStatus as OrderStatusName} from 'api';
import {makeFail, makeGood, ResponseMsg} from '../Response';

const userErrorStatus = 400;

export abstract class OrderStatus {
	to(
		newStatus: OrderStatus,
		assigningWaiters: boolean,
		adminPrivileges: boolean
	): ResponseMsg<void> {
		if (this.isEndStatus()) {
			return makeFail(
				"You can't change the status of a none active order",
				userErrorStatus
			);
		}
		if (newStatus.needsAssignedWaiters() !== assigningWaiters) {
			return makeFail(
				'You must assign waiters to the order before changing to this status',
				userErrorStatus
			);
		}
		if (!adminPrivileges && this.needsChangePrivileges()) {
			return makeFail(
				"You can't change the status of the order at this point",
				userErrorStatus
			);
		}
		return makeGood();
	}

	isEndStatus(): boolean {
		return false;
	}
	needsAssignedWaiters(): boolean {
		return false;
	}
	needsChangePrivileges(): boolean {
		return true;
	} // For example, do you need to be admin to cancel this order?

	static makeStatus(status: OrderStatusName): OrderStatus {
		return status === 'assigned'
			? new Assigned()
			: status === 'canceled'
			? new Canceled()
			: status === 'delivered'
			? new Delivered()
			: status === 'in preparation'
			? new InPreparation()
			: status === 'on the way'
			? new OnTheWay()
			: status === 'ready to deliver'
			? new ReadyToDeliver()
			: status === 'received'
			? new Received()
			: status;
	}
}

class Received extends OrderStatus {
	override needsChangePrivileges(): boolean {
		return false;
	}
}

class InPreparation extends OrderStatus {}

class ReadyToDeliver extends OrderStatus {}

class Assigned extends OrderStatus {
	override needsAssignedWaiters(): boolean {
		return true;
	}
}

class OnTheWay extends OrderStatus {
	override needsAssignedWaiters(): boolean {
		return true;
	}
}

class Delivered extends OrderStatus {
	override isEndStatus(): boolean {
		return true;
	}
}

class Canceled extends OrderStatus {
	override isEndStatus(): boolean {
		return true;
	}
}
