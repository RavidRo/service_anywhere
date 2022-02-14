type OrderStatus = 'unassigned' | 'inprogress' | 'completed';
type OrderIdo = {
	id: OrderID;
	items: string[];
	status: OrderStatus;
};
type Location = {
	x: number;
	y: number;
};
type Corners = {
	topRightGPS: GPS;
	topLeftGPS: GPS;
	bottomRightGPS: GPS;
	bottomLeftGPS: GPS;
};

type GPS = {
	longitude: number;
	latitude: number;
};
