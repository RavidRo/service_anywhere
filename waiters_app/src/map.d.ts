type PointOfInterest = {
	name: string;
	location: Location;
};
type PointMarker = {
	point: PointOfInterest;
	marker: Marker;
};

type MarkerProps = {
	name: string;
	scale: number;
};

import React from 'react';
type Marker = (props: MarkerProps) => React.ReactElement;
