import {Corners, Location} from '../ido';
import Geolocation from '../localization/Geolocation';
import {ILocationService} from '../localization/ILocationService';
import MyLocationModel from '../Models/MyLocationModel';
import configuration from '../../configuration.json';
import Singleton from '../Singleton';

const corners: Corners = {
	bottomRightGPS: configuration.corners['bottom-right-gps'],
	bottomLeftGPS: configuration.corners['bottom-left-gps'],
	topRightGPS: configuration.corners['bottom-right-gps'],
	topLeftGPS: configuration.corners['bottom-left-gps'],
};
export default class MyLocationViewModel implements Singleton {
	private locationService: ILocationService;
	private locationModel: MyLocationModel;

	constructor() {
		this.locationModel = new MyLocationModel();
		this.locationService = new Geolocation(corners);
	}

	startTrackingLocation() {
		this.locationService.watchLocation(
			location => {
				this.locationModel.location = location;
			},
			error => {
				console.warn('Could not get the user location', error);
			}
		);
	}

	get location(): Location | undefined {
		return this.locationModel.location;
	}
}
