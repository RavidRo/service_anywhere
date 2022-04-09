/*
Copied into project the relevant signatures and types from the shared api.ts file
*/

export type OrderStatus =
	| 'received'
	| 'in preparation'
	| 'ready to deliver'
	| 'assigned'
	| 'on the way'
	| 'delivered'
	| 'canceled';

export type OrderID = string;

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

export type WaiterID = string;
export type WaiterIDO = {
	id: WaiterID;
	name: string;
	avialabe: boolean;
};
export type Location = {
	x: number;
	y: number;
};

type Token = string;

export interface GuestAPI {
	// Guest
	loginGuest(phoneNumber: string): Promise<string>;
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

export interface guestCommunication {
	updateGuestLocation: (guestLocation: Location) => void;
}

// guests Notifications from server:
export interface GuestNotificationHandler {
	waiterLocationUpdate: (
		waiterId: WaiterID,
		waiterLocation: Location
	) => void;
	orderStatusChange: (orderId: string, status: OrderStatus) => void;
}
