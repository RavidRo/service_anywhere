export enum Status {
	'RECEIVED',
	'CANCELED',
	//IN_PREPARATION,
	//READY_TO_DELIVER,
	//ASSIGNED,
	//ON_THE_WAY,
	'DELIVERED',
}

export type Review = {
	content: string;
	rating: number;
};
export type Arrived = boolean;

export type OrderID = string;

export type WaiterID = string;

export type Order = {
	orderList: Order[];
	status: Status;
	id: string;
	items: string[];
	review: Review;
	guestLocation: Location;
};
