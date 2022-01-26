import Singleton from '../Singleton';

export default class MyLocationModel extends Singleton {
	private _location?: Location;

	constructor() {
		super();
	}

	set location(location: Location | undefined) {
		this.location = location;
	}

	get location() {
		return this._location;
	}
}
