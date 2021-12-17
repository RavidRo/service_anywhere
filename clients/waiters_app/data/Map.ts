import Location from './Location';

export default class Map {
    public readonly image: String;

    // Translation from GPS to local coordination
    private readonly ratioX: number;
    private readonly ratioY: number;
    private readonly bX: number;
    private readonly bY: number;

    constructor(image: String, topRightGPS: Location, leftBottomGPS: Location) {
        this.image = image;

        this.ratioX = 1 / (leftBottomGPS.x - topRightGPS.x);
        this.ratioY = 1 / (topRightGPS.y - leftBottomGPS.y);
        this.bX = leftBottomGPS.x;
        this.bY = leftBottomGPS.y;
    }

    translateGps(locationGps: Location) {
        locationGps.translate(this.ratioX, this.ratioY, this.bX, this.bY);
    }
}
