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
                console.log(position);
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
                console.log(position);
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

// componentDidMount() {
//   if (hasLocationPermission) {
//     Geolocation.getCurrentPosition(
//         (position) => {
//           console.log(position);
//         },
//         (error) => {
//           // See error code charts below.
//           console.log(error.code, error.message);
//         },
//         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     );
//   }
// }
