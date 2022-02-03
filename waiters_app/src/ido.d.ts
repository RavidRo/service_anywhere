export type OrderStatus = 'unassigned' | 'inprogress' | 'completed';
export type OrderIdo = {
	id: OrderID;
	items: string[];
	status: OrderStatus;
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
