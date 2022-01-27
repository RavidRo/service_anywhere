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