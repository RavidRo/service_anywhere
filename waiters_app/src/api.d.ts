import {ItemIdo, Location, OrderIdo} from './ido';

type Arrived = boolean;
type OrderID = string;
type WaiterID = string;

type Api = {
	// Guest
	createOrder: () => OrderID;
	updateLocationGuest: (location: Location, orderID: OrderID) => void;
	hasOrderArrived: () => Arrived;

	// Dashboard
	getOrders: () => OrderIdo[];
	assignWaiter: (orderID: OrderID, waiterID: WaiterID) => void;
	getWaiters: () => WaiterID[];
	getWaiterByOrder: (orderID: OrderID) => WaiterID;

	// Waiter
	getWaiterOrders: (waiterID: WaiterID) => OrderIdo[];
	getGuestLocation: (orderID: OrderID) => Location;
	orderArrived: (orderID: OrderID) => void;
	login: () => WaiterID;
	getItems: () => ItemIdo[];
};
