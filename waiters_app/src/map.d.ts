import {Location} from './ido';
import React from 'react';

export type PointOfInterest = {
	name: string;
	location: Location;
};
export type PointMarker = {
	point: PointOfInterest;
	marker: Marker;
};

export type MarkerProps = {
	name: string;
	scale: number;
};

export type GPS = {
	longitude: number;
	latitude: number;
};

export type Marker = (props: MarkerProps) => React.ReactElement;
