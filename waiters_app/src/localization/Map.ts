import {Corners} from '../ido';
import {GPS} from '../map';

export default class LocationMap {
	private corners: Corners;
	private width: number;
	private height: number;
	constructor(corners: Corners) {
		this.corners = corners;
		this.width =
			corners.bottomRightGPS.longitude - corners.bottomLeftGPS.longitude;
		this.height =
			corners.topRightGPS.latitude - corners.bottomRightGPS.latitude;
	}

	private distanceFromLine(end1: GPS, end2: GPS, p: GPS) {
		const numerator =
			(end2.longitude - end1.longitude) * (end1.latitude - p.latitude) -
			(end1.longitude - p.longitude) * (end2.latitude - end1.latitude);
		const denominator =
			(end2.longitude - end1.longitude) ** 2 +
			(end2.latitude - end1.latitude) ** 2;
		return Math.abs(numerator) / Math.sqrt(denominator);
	}

	translateGps(location: GPS) {
		const localX =
			this.distanceFromLine(
				this.corners.topLeftGPS,
				this.corners.bottomLeftGPS,
				location
			) / this.width;

		const localY =
			this.distanceFromLine(
				this.corners.topLeftGPS,
				this.corners.topRightGPS,
				location
			) / this.height;

		return {x: localX, y: localY};
	}
}
