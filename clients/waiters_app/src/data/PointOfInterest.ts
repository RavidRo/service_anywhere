import Location from './Location';

export default class PointOfInterest {
    public readonly name: String;
    public location: Location;

    constructor(name: String, location: Location) {
        this.name = name;
        this.location = location;
    }

    public locate(newLocation: Location) {
        return new PointOfInterest(this.name, newLocation);
    }

    public translate(ratioX: number, ratioY: number) {
        return new PointOfInterest(
            this.name,
            this.location.translate(ratioX, ratioY),
        );
    }
}
