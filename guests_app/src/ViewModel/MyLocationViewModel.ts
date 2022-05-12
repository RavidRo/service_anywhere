import Communicate from '../Communication/Communicate';
import Geolocation from '../localization/Geolocation';
import {MyLocationModel} from '../Model/MyLocationModel';
import {LocationService} from '../types';
import configuration from '../../configuration.json';
import {Corners} from '../localization/location';

const corners: Corners = {
	bottomRightGPS: configuration.corners['bottom-right-gps'],
	bottomLeftGPS: configuration.corners['bottom-left-gps'],
	topRightGPS: configuration.corners['bottom-right-gps'],
	topLeftGPS: configuration.corners['bottom-left-gps'],
};

export class MyLocationViewModel {
	private locationModel;
	private communicate: Communicate;
	private locationService: LocationService;

	constructor() {
		this.locationModel = new MyLocationModel();
		this.locationService = new Geolocation(corners);
	}

	getLocation() {
		return this.locationModel.location;
	}
	startTracking() {
		console.log('start tracking location!!');
		this.locationService.watchLocation(
			location => {
				this.locationModel.location = location;
			},
			error => {
				console.warn('Could not get the user location', error);
			}
		);
	}
	stopTracking() {
		throw new Error('Method not implemented.');
	}
}
