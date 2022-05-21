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
	items: Record<string, number>;
	status: OrderStatus;
	creationTime: Date;
	completionTime: Date | undefined | string | number;
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

// export type WaiterDAO = {
// 	id: string;
// 	name: string;
// 	orders: OrderDAO[];
// };

export type Location = {
	x: number;
	y: number;
	mapID: string;
};

export type GuestIDO = {
	id: string;
	name: string;
	phoneNumber: string;
};

type Token = string;

interface GuestAPI {
	// Guest
	login(password: string): Promise<string>;
	getItems: () => Promise<ItemIDO[]>;
	/* need to decide on maps */
	//getMaps: () => Promise<LocalizationDetailsIDO>; // LocalizationDetailsIDO ?
	getGuestOrder: () => Promise<OrderIDO>;
	createOrder(orderItems: Map<string, number>): Promise<OrderID>;
	submitReview(
		orderId: string,
		details: string,
		rating: number
	): Promise<void>;
	cancelOrderGuest: (orderId: OrderID) => Promise<void>;
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
	changeOrderStatus: (orderId: string, status: OrderStatus) => void;
}

interface WaiterAPI {
	login: (password: string) => Promise<void>;
	getItems: () => Promise<ItemIDO[]>;
	// getMaps: () => Promise<LocalizationDetailsIDO>;
	getWaiterOrders: () => Promise<OrderIDO[]>;
	getGuestsDetails: (ids: string[]) => Promise<GuestIDO[]>;
	orderArrived: (orderId: OrderID) => Promise<void>;
	orderOnTheWay: (orderId: OrderID) => Promise<void>;
}
interface WaiterCommunication {
	updateWaiterLocation: (waiterLocation: Location) => void;
}
interface WaiterNotificationHandler {
	updateGuestLocation(guestId: string, guestLocation: Location): void;
	changeOrderStatus(orderId: OrderID, status: OrderStatus): void;
	assignedToOrder(order: OrderIDO): void;
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
