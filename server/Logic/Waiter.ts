import { v4 } from "uuid";

export class Waiter {
	available: Boolean;
	id: string;

    constructor(id?: string) {
		this.id = id ?? v4();   //todo: confirm this
		this.available = true;
	}
}