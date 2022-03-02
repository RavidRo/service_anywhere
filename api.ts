export type OrderStatus =
	| 'recieved'
	| 'in preparation'
	| 'ready to delvier'
	| 'assigned'
	| 'on the way'
	| 'delivered'
	| 'canceled';
type OrderID = string;

export type OrderIDO = {
	id: OrderID;
	guestId: string;
	items: Map<string, number>;
	status: OrderStatus;
	creationTime: Date;
	terminationTime: Date;
};
export type ItemIDO = {
	id: string;
	name: string;
	price: number;
	preparationTime: number;
};

type WaiterID = string;
export type WaiterIDO = {
	id: WaiterID;
	name: string;
	avialabe: boolean;
};
type Location = {
	x: number;
	y: number;
};

type Token = string;

interface GuestAPI {
	// Guest
	login(phone_number: string, password: string): Promise<string>;
	getItems: () => Promise<ItemIDO[]>;
	/* need to decide on maps */
	//getMaps: () => Promise<LocalizationDetailsIDO>; // LocalizationDetailsIDO ?
	getMyOrders: () => Promise<OrderIDO[]>;
	createOrder(order_items: Map<string, number>): Promise<OrderID>;

	submitReview(
		orderId: String,
		details: String,
		mrating: Number
	): Promise<void>;
	cancelOrder: (order_id: OrderID) => Promise<Boolean>;
	updateGuestLocation: (guestlocation: Location) => void;
}
// guests Notifications from server:
interface GuestNotificationHandler {
	waiterLocationUpdate: (
		waiterID: WaiterID,
		waiterLocation: Location
	) => void;
	orderStatusChange: (orderId: String, status: OrderStatus) => void;
}

interface WaiterAPI {
	login: (password: String) => Promise<void>;
	getItems: () => Promise<[ItemIDO]>; //ItemIDO ?
	// getMaps: () => Promise<LocalizationDetailsIDO>;
	getWaiterOrders: () => Promise<[OrderIDO]>;
	//  getGuestDetails: (id: String) => Promise<GuestIDO>; // GuestIDO?
	orderDelivered: (orderId: OrderID) => Promise<void>;
	orderOnTheWay: (orderId: OrderID) => Promise<void>;
}
interface WaiterCommunication {
	updateWaiterLocation: (waiterLocation: Location) => void;
}
interface WaiterNotificationHandler {
	updateGuestLocation(guestID: string, guestLocation: Location): void;
	updateOrderStatus(orderId: OrderID, status: OrderStatus): void;
}

interface DashboardAPI {
	// Dashboard
	login: (password: String) => Promise<void>;
	assignToWaiter: (orderIds: OrderID[], waiterID: WaiterID) => Promise<void>;
	getOrders: () => Promise<OrderIDO[]>;
	getWaiters: () => Promise<WaiterIDO[]>;
	getWaiterByOrder: (orderID: OrderID) => WaiterID;
	cancelOrder: (orderID: OrderID) => Promise<void>;
	changeOrderStatus: (orderID: String, newStatus: String) => Promise<void>;
}

interface ServerNotifications {}
