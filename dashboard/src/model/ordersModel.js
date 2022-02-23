import {makeAutoObservable} from 'mobx';

export default class DashboardModel {
	_orders = [];

	constructor() {
		makeAutoObservable(this);
	}
	set orders(orders) {
		this._orders = orders;
	}

	get orders() {
		console.log(`getting orders model`);
		console.log(this._orders);
		return this._orders;
	}
}
