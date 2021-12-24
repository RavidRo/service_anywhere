import Location from "./types";

function distanceFromLine(end1: Location, end2: Location, p: Location) {
    console.log("end1:" , end1)
    console.log("end2:" , end2)
    console.log("p:" , p)

    const numerator =
        (end2.x - end1.x) * (end1.y - p.y) - (end1.x - p.x) * (end2.y - end1.y);
    const denominator = Math.pow(end2.x - end1.x, 2) + Math.pow(end2.y - end1.y, 2);
    console.log("numerator", numerator)
    console.log("denominator", denominator)
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

    constructor(image: string, corners: Corners) {
        this.image = image;
        this.corners = corners;
        this.width = corners.bottomRightGPS.x - corners.bottomLeftGPS.x;
        this.height = corners.topRightGPS.y - corners.bottomRightGPS.y;
    }

    translateGps(locationGps: Location) {
        console.log("Calculating x")
        const localX =
            distanceFromLine(
                this.corners.topLeftGPS,
                this.corners.bottomLeftGPS,
                locationGps,
            ) / this.width;

            console.log("Calculating y")
        const localY =
            distanceFromLine(
                this.corners.topLeftGPS,
                this.corners.topRightGPS,
                locationGps,
            ) / this.height;

        return new Location(localX, localY);
    }
}