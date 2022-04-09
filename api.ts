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
	terminationTime: Date | undefined;
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
	available: boolean;
};
export type Location = {
	x: number;
	y: number;
};

type Token = string;

interface GuestAPI {
	// Guest
	login(password: string): Promise<string>;
	getItemsGuest: () => Promise<ItemIDO[]>;
	/* need to decide on maps */
	//getMaps: () => Promise<LocalizationDetailsIDO>; // LocalizationDetailsIDO ?
	getGuestOrder: () => Promise<OrderIDO>;
	createOrder(orderItems: Map<string, number>): Promise<OrderID>;
	submitReview(
		orderId: string,
		details: string,
		rating: number
	): Promise<void>;
	cancelOrderGuest: (orderId: OrderID) => Promise<Boolean>;
}

interface guestCommunication {
	updateGuestLocation: (guestLocation: Location) => void;
}

// guests Notifications from server:
interface GuestNotificationHandler {
	waiterLocationUpdate: (
		waiterId: WaiterID,
		waiterLocation: Location
	) => void;
	orderStatusChange: (orderId: string, status: OrderStatus) => void;
}

interface WaiterAPI {
	login: (password: string) => Promise<void>;
	getItemsWaiter: () => Promise<ItemIDO[]>;
	// getMaps: () => Promise<LocalizationDetailsIDO>;
	getWaiterOrders: () => Promise<OrderIDO[]>;
	//  getGuestDetails: (id: string) => Promise<GuestIDO>; // GuestIDO?
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
	login: (password: string) => Promise<void>;
	assignWaiter: (orderId: OrderID, waiterId: WaiterID) => Promise<void>;
	getOrders: () => Promise<OrderIDO[]>;
	getWaiters: () => Promise<WaiterIDO[]>;
	getWaitersByOrder: (orderId: OrderID) => WaiterID[];
	cancelOrderAdmin: (orderId: OrderID) => Promise<void>;
	changeOrderStatus: (orderId: string, newStatus: string) => Promise<void>;
}

interface ServerNotifications {}
