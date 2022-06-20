import Api from '../network/api';
import WaiterModel from '../model/waiterModel';
import {OrderIDO, WaiterIDO} from '../../../api';
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

	synchroniseAssignedWaiters(orders: OrderIDO[]): Promise<void[]> {
		return Promise.all(
			orders.map((order: OrderIDO) =>
				this.api
					.getWaitersByOrder(order.id)
					.then((waiterIds: string[]) => {
						console.info('Synchronised assigned waiters ');
						this.updateAssignedWaiters(order.id, waiterIds);
					})
					.catch((err: string) =>
						alertViewModel.addAlert(
							'Could not find waiter by order ' + err
						)
					)
			)
		);
	}

	getAssignedWaiters(orderID: string): string[] {
		console.info('Getting assigned waiters of ', orderID);
		const assignedWaiters = this.waitersModel.assignedWaiters;
		const assignedWaiter = assignedWaiters.find(
			entry => entry.orderID === orderID
		);
		if (assignedWaiter !== undefined) {
			return assignedWaiter.waiterIds;
		}
		return [];
	}

	updateAssignedWaiters(orderID: string, waiterIds: string[]) {
		console.info('Updating orderID: ' + orderID, 'waiters ' + waiterIds);
		this.waitersModel.updateAssignedWaiters(orderID, waiterIds);
	}

	assignWaiter(orderID: string, waiters: string[]) {
		return this.api.assignWaiter(orderID, waiters);
	}

	getWaitersByOrder(orderID: string) {
		return this.api.getWaitersByOrder(orderID);
	}

	waiterError(waiterID: string, errorMsg: string) {
		alertViewModel.addAlert(`Waiter ${
			this.getWaiters().find(waiter => waiter.id === waiterID)?.username
		}
		 Error: ${errorMsg}`);
	}
}
