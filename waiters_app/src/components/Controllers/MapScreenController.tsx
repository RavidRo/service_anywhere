import React, {useRef} from 'react';

import Location from '../../data/Location';
import Map from '../../data/Map';
import PointOfInterest from '../../data/PointOfInterest';
import MapScreenView from '../Views/MapScreenView';

const points: PointOfInterest[] = [
	// new PointOfInterest('P1', new Location(0.7, 0.7)),
	// new PointOfInterest('P2', new Location(0.3, 0.55)),
];

const map = new Map(
	'https://res.cloudinary.com/noa-health/image/upload/v1640287601/bengurion-map_q32yck.png',
	{
		bottomRightGPS: new Location(34.802516, 31.261649),
		bottomLeftGPS: new Location(34.800838, 31.261649),
		topRightGPS: new Location(34.802516, 31.26355),
		topLeftGPS: new Location(34.800838, 31.26355),
	},
	points
);

interface RefObject {
	open: () => void;
}
export default function MapScreenController(): JSX.Element {
	const refBottomSheet = useRef<RefObject>();

	const openBottomSheet = () => {
		refBottomSheet.current?.open();
	};

	return (
		<MapScreenView
			refBottomSheet={refBottomSheet}
			openBottomSheet={openBottomSheet}
		/>
	);
}
