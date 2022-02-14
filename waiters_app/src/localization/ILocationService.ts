import Location from '../data/Location';

export interface ILocationService {
	getLocation(
		successCallback: (_location: Location) => void,
		errorCallback: (_error: string) => void
	): void;

	watchLocation(
		successCallback: (_location: Location) => void,
		errorCallback: (_error: string) => void
	): void;

	stopWatching(): void;
}
