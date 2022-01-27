import React from 'react';

type MarkerProps = {
	name: string;
	scale: number;
};

export type Marker = (props: MarkerProps) => React.ReactElement;
