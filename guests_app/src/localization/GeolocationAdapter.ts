import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {GPS} from './location';

export default class GeolocationAdapter {
	private watchID?: number;

	watchLocation(
		successCallback: (location: GPS) => void,
		errorCallback: (error: string) => void
	) {
		this.stopWatching();
		this.watchID = Geolocation.watchPosition(
			position => {
				successCallback(position.coords);
			},
			error => {
				errorCallback(error.message);
			},
			{
				accuracy: {
					android: 'high',
					ios: 'bestForNavigation',
				},
				enableHighAccuracy: true,
				interval: 500,
				fastestInterval: 500,
				showLocationDialog: true,
				distanceFilter: 1,
			}
		);
	}
	stopWatching(): void {
		if (this.watchID) {
			Geolocation.clearWatch(this.watchID);
		}
	}
	getLocation(
		successCallback: (location: GPS) => void,
		errorCallback: (error: string) => void
	): void {
		Geolocation.getCurrentPosition(
			position => {
				successCallback(position.coords);
			},
			error => {
				errorCallback(error.message);
			},
			{
				enableHighAccuracy: true,
				timeout: 15000,
				maximumAge: 5000,
				showLocationDialog: true,
			}
		);
	}
}
