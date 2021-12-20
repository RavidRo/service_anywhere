import Location from '../data/Location';
import {LocationService} from './LocationService';

export default class DummyLocation implements LocationService {
    private location: Location;
    private timer: NodeJS.Timer | undefined;

    constructor() {
        this.location = new Location(0, 0);
    }

    private getCurrentLocation(): Location {
        this.location = this.location.add(0.05, 0.05);
        return this.location;
    }

    getLocation(
        successCallback: (location: Location) => void,
        _: (error: string) => void,
    ): void {
        successCallback(this.getCurrentLocation());
    }
    watchLocation(
        successCallback: (location: Location) => void,
        _: (error: string) => void,
    ): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(
            () => successCallback(this.getCurrentLocation()),
            500,
        );
    }
    stopWatching(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}
