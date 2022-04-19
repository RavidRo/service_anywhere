import {makeAutoObservable} from 'mobx';
import {WaiterIDO} from '../../../api';

export default class waiterModel {
	_waiters: WaiterIDO[] = [];

	constructor() {
		makeAutoObservable(this);
	}

	set waiters(waiters: WaiterIDO[]) {
		this._waiters = waiters;
	}

	get waiters(): WaiterIDO[] {
		return this._waiters;
	}
}
