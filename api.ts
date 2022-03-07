export type OrderStatus =
	| 'received'
	| 'in preparation'
	| 'ready to deliver'
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
	login(phoneNumber: string, password: string): Promise<string>;
	getItems: () => Promise<ItemIDO[]>;
	/* need to decide on maps */
	//getMaps: () => Promise<LocalizationDetailsIDO>; // LocalizationDetailsIDO ?
	getGuestOrder: () => Promise<OrderIDO>;
	createOrder(orderItems: Map<string, number>): Promise<OrderID>;

	submitReview(
		orderId: String,
		details: String,
		rating: Number
	): Promise<void>;
	cancelOrder: (orderId: OrderID) => Promise<Boolean>;
	updateGuestLocation: (guestLocation: Location) => void;
}
// guests Notifications from server:
interface GuestNotificationHandler {
	waiterLocationUpdate: (
		waiterId: WaiterID,
		waiterLocation: Location
	) => void;
	orderStatusChange: (orderId: String, status: OrderStatus) => void;
}

interface WaiterAPI {
	login: (password: String) => Promise<void>;
	getItems: () => Promise<ItemIDO[]>; //ItemIDO ?
	// getMaps: () => Promise<LocalizationDetailsIDO>;
	getWaiterOrders: () => Promise<OrderIDO[]>;
	//  getGuestDetails: (id: String) => Promise<GuestIDO>; // GuestIDO?
	orderArrived: (orderId: OrderID) => Promise<void>;
	orderOnTheWay: (orderId: OrderID) => Promise<void>;
}
interface WaiterCommunication {
	updateWaiterLocation: (waiterLocation: Location) => void;
}
interface WaiterNotificationHandler {
	updateGuestLocation(guestId: string, guestLocation: Location): void;
	updateOrderStatus(orderId: OrderID, status: OrderStatus): void;
}

interface DashboardAPI {
	// Dashboard
	login: (password: String) => Promise<void>;
	assignWaiter: (orderIds: OrderID[], waiterId: WaiterID) => Promise<void>;
	getOrders: () => Promise<OrderIDO[]>;
	getWaiters: () => Promise<WaiterIDO[]>;
	getWaitersByOrder: (orderId: OrderID) => WaiterID;
	cancelOrder: (orderId: OrderID) => Promise<void>;
	changeOrderStatus: (orderId: String, newStatus: String) => Promise<void>;
}

interface ServerNotifications {}