import {OrderStatus as OrderStatusName} from 'api';
import {makeFail, makeGood, ResponseMsg} from '../Response';

export abstract class OrderStatus {
	to(
		newStatus: OrderStatus,
		assigningWaiters: boolean,
		adminPrivileges: boolean
	): ResponseMsg<void> {
		if (this.isEndStatus()) {
			return makeFail(
				"You can't change the status of a none active order",
				400
			);
		}
		if (newStatus.needsAssignedWaiters() !== assigningWaiters) {
			return makeFail(
				'You must assign waiters to the order before changing to this status',
				400
			);
		}
		if (!adminPrivileges && this.needsChangePrivileges()) {
			return makeFail(
				"You can't change the status of the order at this point",
				400
			);
		}
		return makeGood();
	}

	abstract isEndStatus(): boolean;
	abstract needsAssignedWaiters(): boolean;
	abstract needsChangePrivileges(): boolean; // For example, do you need to be admin to cancel this order?

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
	isEndStatus(): boolean {
		return false;
	}
	needsAssignedWaiters() {
		return false;
	}
	needsChangePrivileges(): boolean {
		return false;
	}
}

class InPreparation extends OrderStatus {
	isEndStatus(): boolean {
		return false;
	}
	needsAssignedWaiters() {
		return false;
	}

	needsChangePrivileges(): boolean {
		return true;
	}
}

class ReadyToDeliver extends OrderStatus {
	isEndStatus(): boolean {
		return false;
	}
	needsAssignedWaiters() {
		return false;
	}

	needsChangePrivileges(): boolean {
		return true;
	}
}

class Assigned extends OrderStatus {
	isEndStatus(): boolean {
		return false;
	}
	needsAssignedWaiters(): boolean {
		return true;
	}
	needsChangePrivileges(): boolean {
		return true;
	}
}

class OnTheWay extends OrderStatus {
	isEndStatus(): boolean {
		return false;
	}
	needsAssignedWaiters(): boolean {
		return true;
	}
	needsChangePrivileges(): boolean {
		return true;
	}
}

class Delivered extends OrderStatus {
	isEndStatus(): boolean {
		return true;
	}
	needsAssignedWaiters(): boolean {
		return false;
	}
	needsChangePrivileges(): boolean {
		return true;
	}
}

class Canceled extends OrderStatus {
	isEndStatus(): boolean {
		return true;
	}
	needsAssignedWaiters(): boolean {
		return false;
	}
	needsChangePrivileges(): boolean {
		return true;
	}
}
