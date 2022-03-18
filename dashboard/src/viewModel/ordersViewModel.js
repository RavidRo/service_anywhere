export default class OrdersViewModel {
	orders = []
	constructor(ordersModel){
		this.ordersModel = ordersModel
		this.orders = ordersModel.orders
	}
	getOrders() {
		return this.ordersModel.getOrders();
	}
	
	setOrders(orders){
		this.ordersModel.setOrders();
	}
}
