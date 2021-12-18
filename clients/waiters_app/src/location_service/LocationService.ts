import Location from '../data/Location';

export default interface LocationService {
    getLocation(
        successCallback: (location: Location) => void,
        errorCallback: (error: string) => void,
    ): void;

    watchLocation(
        successCallback: (location: Location) => void,
        errorCallback: (error: string) => void,
    ): void;

    stopWatching(): void;
}
