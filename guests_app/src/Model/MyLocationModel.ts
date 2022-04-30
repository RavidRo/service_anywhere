import {makeAutoObservable} from 'mobx';
import Location from '../types';

export class MyLocationModel {
	private _location: Location | null;

	public constructor() {
		makeAutoObservable(this);
	}

	get location() {
		return this._location;
	}

	set location(location: Location | null) {
		this._location = location;
	}
}