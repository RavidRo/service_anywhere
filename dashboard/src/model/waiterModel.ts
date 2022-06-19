import {makeAutoObservable} from 'mobx';
import {WaiterIDO} from '../../../api';

export type assignedWaitersType = {orderID: string; waiterIds: string[]}[];

export default class waiterModel {
	_waiters: WaiterIDO[] = [];
	_assignedWaiters: assignedWaitersType = [];

	constructor() {
		makeAutoObservable(this);
	}

	set waiters(waiters: WaiterIDO[]) {
		console.info('Setting waiters to ', waiters);
		this._waiters = waiters;
	}

	get waiters(): WaiterIDO[] {
		console.info('Getting waiters', this._waiters);
		return this._waiters;
	}

	get assignedWaiters(): assignedWaitersType {
		return this._assignedWaiters;
	}

	set assignedWaiters(assignedWaiters: assignedWaitersType) {
		console.info('Setting assigned waiters');
		this._assignedWaiters = assignedWaiters;
	}

	updateAssignedWaiters(orderID: string, waiterIds: string[]): void {
		console.info('Updating assigned waiters with ', orderID, waiterIds);
		const assignedWaiterObject = this._assignedWaiters.find(
			entry => entry.orderID === orderID
		);
		if (assignedWaiterObject !== undefined) {
			assignedWaiterObject.waiterIds = waiterIds;
		} else {
			this._assignedWaiters.push({
				orderID: orderID,
				waiterIds: waiterIds,
			});
		}
	}
}
