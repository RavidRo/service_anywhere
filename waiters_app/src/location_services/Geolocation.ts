import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import Location from '../data/Location';

import {LocationService} from './LocationService';

export default class Gps implements LocationService {
	private watchID?: number;

	constructor() {
		if (Platform.OS === 'android') {
			PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
			);
		}
	}
	watchLocation(
		successCallback: (location: Location) => void,
		errorCallback: (error: string) => void
	) {
		this.stopWatching();
		this.watchID = Geolocation.watchPosition(
			position => {
				const newLocation = new Location(
					position.coords.longitude,
					position.coords.latitude
				);
				successCallback(newLocation);
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
		successCallback: (location: Location) => void,
		errorCallback: (error: string) => void
	): void {
		Geolocation.getCurrentPosition(
			position => {
				successCallback(
					new Location(
						position.coords.longitude,
						position.coords.latitude
					)
				);
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
