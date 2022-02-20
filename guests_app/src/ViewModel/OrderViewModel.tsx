import Requests from 'guests_app/src/Networking/requests';
import { Order, OrderID, OrderStatus } from 'guests_app/src/types';
import {OrderModel} from '../Model/OrderModel';


export default class OrderViewModel {
	private order_model = OrderModel.getInstance();
	private requests;

	constructor(requests: Requests) {
		this.order_model = OrderModel.getInstance();
		this.requests = requests
	}

	createOrder(items: Map<string, Number>): Promise<Order> {
		return this.requests.createOrder(items).then(order_id => {
			const order: Order = {
				id: order_id,
				items: items,
				status: 'recieved',
			}
			this.order_model.order = order;
			return order;
		});
	}
	
	// ** not sure if it's correct **
	cancelOrder() : boolean
	{	
		const order_id = this.order_model.getOrderId();
		if(order_id != '')
		{
			this.requests.cancelOrder(order_id).then((res) => {
				if(res)
				{
					this.order_model.order = null;
					return true;
				}
				return false;
				})
		}
		console.log("ERROR: cancelOrder called when order doesn't exists\n");
		return false;
	}

	getOrder(){
		return this.order_model.order;
	}

	submitReview(deatils: String, rating: Number): Promise<void>{
		return this.requests.submitReview(deatils,rating);
	}
	updateOrderStatus(status: OrderStatus) : void{
		if(this.getOrder() != null)
			this.order_model.updateOrderStatus(status);
	}

	/* Optional: updateWaiterLocation(){} */
	
}
