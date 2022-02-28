//import {makeAutoObservable} from 'mobx';
import Singleton from '../Singeltone';
import Location from '../types';

export class MyLocationModel extends Singleton {
	private _location: Location | null;

	public constructor() {
		super();
		//		makeAutoObservable(this);
	}

	get location() {
		return this._location;
	}

	set location(location: Location | null) {
		this._location = location;
	}
}
