import Geolocation from '../localization/Geolocation';
import {ILocationService} from '../localization/ILocationService';
import MyLocationModel from '../Models/MyLocationModel';
import Singleton from '../Singleton';

const corners: Corners = {
	bottomRightGPS: {longitude: 34.802516, latitude: 31.261649},
	bottomLeftGPS: {longitude: 34.800838, latitude: 31.261649},
	topRightGPS: {longitude: 34.802516, latitude: 31.26355},
	topLeftGPS: {longitude: 34.800838, latitude: 31.26355},
};
export default class MyLocationViewModel extends Singleton {
	private locationService: ILocationService;
	private locationModel: MyLocationModel;

	constructor() {
		super();

		this.locationModel = new MyLocationModel();
		this.locationService = new Geolocation(corners);
		this.locationService.watchLocation(
			location => {
				this.locationModel.location = location;
			},
			error => {
				console.error('Could not get your location: ', error);
			}
		);
	}

	getLocation(): Location | undefined {
		return this.locationModel.location;
	}
}
