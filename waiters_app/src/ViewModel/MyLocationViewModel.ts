import {Corners, Location} from '../ido';
import Geolocation from '../localization/Geolocation';
import {ILocationService} from '../localization/ILocationService';
import MyLocationModel from '../Models/MyLocationModel';

const corners: Corners = {
	bottomRightGPS: {longitude: 34.802516, latitude: 31.261649},
	bottomLeftGPS: {longitude: 34.800838, latitude: 31.261649},
	topRightGPS: {longitude: 34.802516, latitude: 31.26355},
	topLeftGPS: {longitude: 34.800838, latitude: 31.26355},
};
export default class MyLocationViewModel {
	private locationService: ILocationService;
	private locationModel: MyLocationModel;

	constructor() {
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

	get location(): Location | undefined {
		return this.locationModel.location;
	}
}
