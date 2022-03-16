import {makeAutoObservable} from 'mobx';

export default class DashboardModel {
	_orders = [{items: ['a', 'b'], id: '1', status: '0'}];

	constructor() {
		makeAutoObservable(this);
	}
	set orders(orders) {
		this._orders = orders;
	}

	get orders() {
		console.log(this._orders);
		return this._orders;
	}

	cancelOrder(orderId) {
		alert(`not implemented, orderId: ${orderId}`);
	}

	changeOrderStatus(orderId, newStatus) {
		alert(`not implemented, orderId: ${orderId}, newStatus: ${newStatus}`);
	}
}
