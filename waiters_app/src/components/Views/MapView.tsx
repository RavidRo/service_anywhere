import React from 'react';
import {
	LayoutChangeEvent,
	StyleProp,
	Text,
	View,
	ViewStyle,
} from 'react-native';
import PointOfInterest from 'waiters_app/src/data/PointOfInterest';
import {Marker} from '../markers/Marker';

import MyZoomableImage from '../MyZoomableImage';

type MapComponentProps = {
	style?: StyleProp<ViewStyle>;
	markers: [PointOfInterest, Marker][];
	onLayout: (event: LayoutChangeEvent) => void;
	imageHeight: number | undefined;
	imageWidth: number | undefined;
	width: number | undefined;
	height: number | undefined;
	imageURL: string;
};

export default function MapComponent(props: MapComponentProps) {
	return (
		<View style={props.style} onLayout={props.onLayout}>
			{props.imageHeight &&
			props.imageWidth &&
			props.width &&
			props.height ? (
				<MyZoomableImage
					imageHeight={props.imageHeight}
					imageWidth={props.imageWidth}
					uri={props.imageURL}
					pointsOfInterest={props.markers}
					parentWidth={props.width}
					parentHeight={props.height}
				/>
			) : (
				<Text>Loading</Text>
			)}
		</View>
	);
}
