export default class Location {
	public readonly x: number;
	public readonly y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public add(inX: number, inY: number) {
		return new Location(this.x + inX, this.y + inY);
	}

	public subtract(otherLoc: Location) {
		return new Location(this.x - otherLoc.x, this.y - otherLoc.y);
	}

	public translate(
		ratioX: number,
		ratioY: number,
		bX: number = 0,
		bY: number = 0
	) {
		return new Location(bX + this.x * ratioX, bY + this.y * ratioY);
	}
}

export interface LocationService {
	getLocation(
		successCallback: (location: Location) => void,
		errorCallback: (error: string) => void
	): void;

	watchLocation(
		successCallback: (location: Location) => void,
		errorCallback: (error: string) => void
	): void;

	stopWatching(): void;
}

export type OrderID = string;
export type OrderStatus = 'recieved' | 'inprogress' | 'on the way' | 'arrived';
export type Order = {
	id: OrderID;
	items: Map<String, Number>;
	status: OrderStatus;
};

export type Item = {
	id: string;
	name: string;
	prepare_time: Number;
};

export type Waiter = {
	id: string;
	location: Location;
};
