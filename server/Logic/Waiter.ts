import {WaiterIDO} from 'api';
import {v4} from 'uuid';

export class Waiter {
	available: boolean;
	id: string;
	name: string;

	constructor(id?: string) {
		//todo: get name from db
		this.id = id ?? v4();
		this.available = true;
	}

	getDetails(): WaiterIDO {
		return {avialabe: this.available, id: this.id, name: this.name};
	}
}
