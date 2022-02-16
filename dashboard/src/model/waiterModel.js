import {makeAutoObservable} from 'mobx';
import {CaughtException} from 'mobx/dist/internal';

export default class DashboardModel {
	_waiters = [];

	constructor() {
		makeAutoObservable(this);
	}

	set waiters(waiters) {
		this._waiters = waiters;
	}

	get waiters() {
		return this._waiters;
	}

	assignOrderToWaiter(order, waiterId) {
		console.log('not implemented');
	}
}
