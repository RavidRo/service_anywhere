import Api from '../network/api';
import WaiterModel from '../model/waiterModel';
import {WaiterIDO} from '../../../api';
import Singleton from '../singleton';

export default class WaitersViewModel {
	private waitersModel: WaiterModel;
	private api: Api;
	constructor(waitersModel: WaiterModel, api: Api) {
		this.waitersModel = waitersModel;
		this.api = api;
	}

	get waiters(): WaiterIDO[] {
		this.api
			.getWaiters()
			.then(waiters => (this.waitersModel.waiters = waiters));

		return this.waitersModel.waiters;
	}

	set waiters(waiters: WaiterIDO[]) {
		this.waitersModel.waiters = waiters;
	}

	assignWaiter(orderId: string, waiter: string) {
		return this.api.assignWaiter(orderId, waiter);
	}

	getWaitersByOrder(orderId: string) {
		return this.api.getWaitersByOrder(orderId);
	}
}
