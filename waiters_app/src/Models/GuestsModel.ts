import {makeAutoObservable} from 'mobx';
import {Location} from '../ido';

export default class GuestsModel {
	private _guests: Map<string, Guest>; //<ID, Object>
	constructor() {
		this._guests = new Map();
		makeAutoObservable(this);
	}

	get guests(): Guest[] {
		return Array.from(this._guests.values());
	}

	set guests(newGuests: Guest[]) {
		this._guests.clear();
		newGuests.forEach(guest => {
			this._guests.set(guest.id, guest);
		});
	}

	updateGuestLocation(guestID: string, location: Location): void {
		const guest = this._guests.get(guestID);
		if (guest) {
			guest.location = location;
		}
	}
}

export class Guest {
	public readonly id: string;
	public readonly name: string;
	public readonly phoneNumber: string;
	public location?: Location;

	constructor(id: string) {
		this.id = id;
		this.name = '';
		this.phoneNumber = '';
	}
}
