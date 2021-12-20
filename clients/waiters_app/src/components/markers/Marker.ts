import React from 'react';
import PointOfInterest from '../../data/PointOfInterest';

type MarkerProps = {
    point: PointOfInterest;
    scale: number;
};

export type Marker = (props: MarkerProps) => React.ReactElement;
