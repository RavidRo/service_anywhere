// import Singleton from '../Singleton';
import {makeAutoObservable} from 'mobx';

export default class MyLocationModel {
	private _location: Location | undefined;

	constructor() {
		// super();
		makeAutoObservable(this);
	}

	set location(location: Location | undefined) {
		this._location = location;
	}

	get location() {
		return this._location;
	}
}
