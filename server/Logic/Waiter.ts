import {v4} from 'uuid';

export class Waiter {
	available: Boolean;
	id: string;

	constructor(id?: string) {
		this.id = id ?? v4();
		this.available = true;	//todo: use this, add name
	}
}
