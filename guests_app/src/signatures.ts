/*
Copied into project the relevant signatures and types from the shared api.ts file
*/

import Location, { ItemIDO, OrderID, OrderIDO, OrderStatus, WaiterID } from "./types";

export interface GuestAPI {
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