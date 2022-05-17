import {makeAutoObservable} from 'mobx';
import {WaiterIDO} from '../../../api';

export default class waiterModel {
	_waiters: WaiterIDO[] = [];

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
}
