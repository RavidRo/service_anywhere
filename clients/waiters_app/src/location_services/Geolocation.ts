import Geolocation from 'react-native-geolocation-service';

import Location from '../data/Location';

import {LocationService} from './LocationService';

export default class Gps implements LocationService {
    watchLocation(
        successCallback: (location: Location) => void,
        errorCallback: (error: string) => void,
    ) {
        Geolocation.watchPosition(
            position => {
                successCallback(
                    new Location(
                        position.coords.latitude,
                        position.coords.longitude,
                    ),
                );
            },
            error => {
                errorCallback(error.message);
            },
            {
                enableHighAccuracy: true,
                interval: 5000,
                showLocationDialog: true,
            },
        );
    }
    stopWatching(): void {
        Geolocation.stopObserving();
    }
    getLocation(
        successCallback: (location: Location) => void,
        errorCallback: (error: string) => void,
    ): void {
        Geolocation.getCurrentPosition(
            position => {
                successCallback(
                    new Location(
                        position.coords.latitude,
                        position.coords.longitude,
                    ),
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
            },
        );
    }
}
