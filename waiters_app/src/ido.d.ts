import {GPS} from './map';

export type OrderStatus = 'unassigned' | 'inprogress' | 'completed';
export type OrderIdo = {
	id: OrderID;
	guestID: string;
	items: Record<string, int>;
	status: OrderStatus;
	creationTime: Date;
	terminationTime: Date;
};
export type Location = {
	x: number;
	y: number;
};
export type Corners = {
	topRightGPS: GPS;
	topLeftGPS: GPS;
	bottomRightGPS: GPS;
	bottomLeftGPS: GPS;
};
export type ItemIdo = {
	id: string;
	name: string;
	price: double;
	preparationTime: double;
};
