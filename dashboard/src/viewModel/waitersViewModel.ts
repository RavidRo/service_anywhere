import Api from '../network/api';
import WaiterModel from '../model/waiterModel';
import {WaiterIDO} from '../../../api';
import {alertViewModel} from '../context';

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
				alertViewModel.addAlert(
					'Could not get waiters please reload, Error:' + err
				)
			);
	}
	assignWaiter(orderID: string, waiters: string[]) {
		return this.api.assignWaiter(orderID, waiters);
	}

	getWaitersByOrder(orderID: string) {
		return this.api.getWaitersByOrder(orderID);
	}
}
