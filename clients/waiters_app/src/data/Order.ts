import {LocationService} from '../location_services/LocationService';
import ServerLocation from '../location_services/ServerLocation';

import Location from './Location';

import {Order as OrderAPI} from './api';

export default class Order {
    public readonly id: string;
    public readonly items: string[];
    private status: 'unassigned' | 'inprogress' | 'completed';
    private location?: Location;

    private readonly locationService: LocationService;

    constructor(order: OrderAPI) {
        this.id = order.id;
        this.items = order.items;
        this.status = order.status;

        this.locationService = new ServerLocation(this.id);
    }

    onNewLocation(callback: (location: Location) => void) {
        this.locationService.stopWatching();
        this.locationService.watchLocation(
            newLocation => {
                this.location = newLocation;
                callback(newLocation);
            },
            () => {},
        );
    }

    completed() {
        this.stopTracking();
        this.status = 'completed';
    }

    stopTracking() {
        this.locationService.stopWatching();
    }
}
