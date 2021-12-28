import Location from './Location';
import PointOfInterest from './PointOfInterest';

// https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
function distanceFromLine(end1: Location, end2: Location, p: Location) {
    const numerator =
        (end2.x - end1.x) * (end1.y - p.y) - (end1.x - p.x) * (end2.y - end1.y);
    const denominator = (end2.x - end1.x) ** 2 + (end2.y - end1.y) ** 2;
    return Math.abs(numerator) / Math.sqrt(denominator);
}

type Corners = {
    topRightGPS: Location;
    topLeftGPS: Location;
    bottomRightGPS: Location;
    bottomLeftGPS: Location;
};

export default class Map {
    public readonly image: string;

    // Translation from GPS to local coordination
    private readonly corners: Corners;
    private readonly width: number;
    private readonly height: number;

    // In local coordinates
    public readonly points: PointOfInterest[];

    constructor(image: string, corners: Corners, points: PointOfInterest[]) {
        this.image = image;
        this.corners = corners;
        this.width = corners.bottomRightGPS.x - corners.bottomLeftGPS.x;
        this.height = corners.topRightGPS.y - corners.bottomRightGPS.y;

        this.points = points;
    }

    translateGps(locationGps: Location) {
        const localX =
            distanceFromLine(
                this.corners.topLeftGPS,
                this.corners.bottomLeftGPS,
                locationGps,
            ) / this.width;

        const localY =
            distanceFromLine(
                this.corners.topLeftGPS,
                this.corners.topRightGPS,
                locationGps,
            ) / this.height;

        return new Location(localX, localY);
    }
}
