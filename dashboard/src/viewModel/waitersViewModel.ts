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

	getWaiters(): WaiterIDO[] {
		return this.waitersModel.waiters;
	}

	setWaiters(waiters: WaiterIDO[]) {
		this.waitersModel.waiters = waiters;
	}

	synchroniseWaiters(): Promise<void> {
		return this.api
			.getWaiters()
			.then(waiters => {
				this.waitersModel.waiters = waiters;
			})
			.catch(err =>
				alert('Could not get waiters please reload, Error:' + err)
			);
	}
	assignWaiter(orderId: string, waiter: string) {
		return this.api.assignWaiter(orderId, waiter);
	}

	getWaitersByOrder(orderId: string) {
		return this.api.getWaitersByOrder(orderId);
	}
}
