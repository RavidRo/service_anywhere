import {makeAutoObservable} from 'mobx';
import {Location} from '../ido';

export default class MyLocationModel {
	private _location: Location | undefined;

	constructor() {
		makeAutoObservable(this);
	}

	set location(location: Location | undefined) {
		this._location = location;
	}

	get location() {
		return this._location;
	}
}
