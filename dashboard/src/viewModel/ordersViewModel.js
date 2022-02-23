export default class OrdersViewModel {
	constructor(ordersModel) {
		this.ordersModel = ordersModel;
	}
	get orders() {
		console.log('get orders view model');
		return this.ordersModel.orders;
	}

	set orders(orders) {
		this.ordersModel.setOrders(orders);
	}
}
