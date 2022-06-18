export const STATUSES = [
	'received',
	'in preparation',
	'ready to deliver',
	'assigned',
	'on the way',
	'delivered',
	'canceled',
] as const;
export type OrderStatus = typeof STATUSES[number];
type OrderID = string;

export type OrderIDO = {
	id: OrderID;
	guestID: string;
	items: Record<string, number>;
	status: OrderStatus;
	creationTime: Date;
	completionTime: Date | undefined;
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
	username: string;
};

export type ReviewIDO = {
	details: string;
	rating: number;
};
// export type WaiterDAO = {
// 	id: string;
// 	name: string;
// 	orders: OrderDAO[];
// };

export type GPS = {
	longitude: number;
	latitude: number;
};
export type Corners = {
	topRightGPS: GPS;
	topLeftGPS: GPS;
	bottomRightGPS: GPS;
	bottomLeftGPS: GPS;
};
export type MapIDO = {
	id: string;
	name: string;
	corners: Corners;
	imageURL: string;
};

export type Location = {
	x: number;
	y: number;
	mapID: string;
};

export type GuestIDO = {
	id: string;
	username: string;
	phoneNumber: string;
};

type Token = string;

interface GuestAPI {
	// Guest
	login(password: string): Promise<string>;
	getItems: () => Promise<ItemIDO[]>;
	/* need to decide on maps */
	getMaps: () => Promise<MapIDO[]>;
	getGuestOrder: () => Promise<OrderIDO>;
	createOrder(orderItems: Map<string, number>): Promise<OrderID>;
	submitReview(
		orderID: string,
		details: string,
		rating: number
	): Promise<void>;
	cancelOrderGuest: (orderID: OrderID) => Promise<void>;
}

interface guestCommunication {
	updateGuestLocation: (guestLocation: Location) => void;
	locationErrorGuest: (errorMsg: string) => void;
}

// guests Notifications from server:
interface GuestNotificationHandler {
	waiterLocationUpdate: (
		waiterID: WaiterID,
		waiterLocation: Location
	) => void;
	changeOrderStatus: (orderID: string, status: OrderStatus) => void;
}

interface WaiterAPI {
	login: (username: string, password: string) => Promise<string>;
	getItems: () => Promise<ItemIDO[]>;
	getMaps: () => Promise<MapIDO[]>;
	getWaiterOrders: () => Promise<OrderIDO[]>;
	getGuestsDetails: (ids: string[]) => Promise<GuestIDO[]>;
	orderArrived: (orderID: OrderID) => Promise<void>;
	orderOnTheWay: (orderID: OrderID) => Promise<void>;
}
interface WaiterCommunication {
	updateWaiterLocation: (waiterLocation: Location) => void;
	locationErrorWaiter: (errorMsg: string) => void;
}
interface WaiterNotificationHandler {
	updateGuestLocation(guestID: string, guestLocation: Location): void;
	changeOrderStatus(orderID: OrderID, status: OrderStatus): void;
	assignedToOrder(order: OrderIDO): void;
}

interface DashboardAPI {
	// Dashboard
	login: (password: string) => Promise<void>;
	assignWaiter: (orderID: OrderID, waiterID: WaiterID) => Promise<void>;
	getOrders: () => Promise<OrderIDO[]>;
	getWaiters: () => Promise<WaiterIDO[]>;
	getWaitersByOrder: (orderID: OrderID) => WaiterID[];
	cancelOrderAdmin: (orderID: OrderID) => Promise<void>;
	changeOrderStatus: (orderID: string, newStatus: string) => Promise<void>;
}
