//import {makeAutoObservable} from 'mobx';
import Singleton from '../Singeltone';
import Location, {Order, OrderID, OrderStatus, Waiter} from '../types';

export class OrderModel extends Singleton{
	
	private static instance: OrderModel;
	private _order: Order | null;
	private waiters: Waiter[];
	
	public constructor() {
		super();
		this._order = null;
		this.waiters = [];
	//	makeAutoObservable(this);
	}
	removeOrder(){
		this._order = null;
		this.waiters = [];
	}

	updateOrderStatus(orderID: OrderID, status: OrderStatus) {
		if(this._order != null)
			if(this.order?.id == orderID)
			{
				this._order.status = status;

			}
	}

	getOrderId(){
		return this._order != null? this._order.id : ''
	}

	updateWaiterLocation(waiterId: string, waiterLocation: Location)
	{
		let found = false;
		if(this.order != null)
		{
			for(let waiter of this.waiters)
			{
				if(waiter.id == waiterId)
				{
					found = true;
					waiter.location = waiterLocation;
					break;
				}
			}
			if(!found)
				this.waiters.push({id: waiterId, location: waiterLocation})
		}
	}

	getWaitersLocations() 
	{
		let locations = [];
		for(let waiter of this.waiters)
		{
			locations.push(waiter.location);
		}
		return locations;
	}

	get order() {
		return this._order;
	}

	set order(order: Order | null) {
		this._order = order;
	}
	
}
