import {WaiterIDO} from 'api';

export class Waiter {
	available: boolean;
	readonly id: string;
	readonly name: string;

	constructor(id: string, name: string, available: boolean) {
		this.id = id;
		this.available = available;
		this.name = name;
	}

	getDetails(): WaiterIDO {
		return {available: this.available, id: this.id, name: this.name};
	}
}
