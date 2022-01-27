import Singleton from '../Singleton';
import {makeAutoObservable} from 'mobx';

export default class MyLocationModel extends Singleton {
	private _location?: Location;

	constructor() {
		super();
		makeAutoObservable(this);
	}

	set location(location: Location | undefined) {
		this.location = location;
	}

	get location() {
		return this._location;
	}
}
