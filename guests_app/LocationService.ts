import Geolocation from 'react-native-geolocation-service';
import Location, {LocationService} from './types';

export default class Gps implements LocationService {
	watchLocation(
		successCallback: (location: Location) => void,
		errorCallback: (error: string) => void
	) {
		Geolocation.watchPosition(
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
				showLocationDialog: true,
				accuracy: {
					android: 'high',
					ios: 'bestForNavigation',
				},
				interval: 500,
				fastestInterval: 500,
				distanceFilter: 1,
			}
		);
	}
	stopWatching(): void {
		Geolocation.stopObserving();
	}
	getLocation(
		successCallback: (location: Location) => void,
		errorCallback: (error: string) => void
	): void {
		Geolocation.getCurrentPosition(
			position => {
				console.log(position);
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
