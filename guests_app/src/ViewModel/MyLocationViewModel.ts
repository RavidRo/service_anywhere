import Communicate from '../Communication/Communicate';
import {MyLocationModel} from '../Model/MyLocationModel';
import {LocationService} from '../types';

export class MyLocationViewModel {
	private locationModel;
	private communicate: Communicate;
	private locationService: LocationService;

	constructor() {
		this.locationModel = new MyLocationModel();
	}

	getLocation() {
		return this.locationModel.location;
	}
	startTracking() {
		throw new Error('Method not implemented.');
	}
	stopTracking() {
		throw new Error('Method not implemented.');
	}
}
