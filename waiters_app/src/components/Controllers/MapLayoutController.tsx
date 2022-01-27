import React, {useState} from 'react';
import {Image, LayoutChangeEvent, StyleProp, ViewStyle} from 'react-native';
import PointOfInterest from 'waiters_app/src/data/PointOfInterest';

import MapsViewModel from '../../ViewModel/MapsViewModel';
import {Marker} from '../markers/Marker';
import MapView from '../Views/MapView';

type MapComponentProps = {
	style?: StyleProp<ViewStyle>;
	markers: [PointOfInterest, Marker][];
};

export default function MapLayoutController({
	style,
	markers,
}: MapComponentProps) {
	const mapViewModel = new MapsViewModel();
	const imageURL = mapViewModel.getMapDetails().imageURL;

	const [imageWidth, setImageWidth] = useState<number | undefined>();
	const [imageHeight, setImageHeight] = useState<number | undefined>();
	const [width, setWidth] = useState<number | undefined>();
	const [height, setHeight] = useState<number | undefined>();

	Image.getSize(imageURL, (width, height) => {
		setImageWidth(width);
		setImageHeight(height);
	});

	const onLayout = (event: LayoutChangeEvent) => {
		const {height, width} = event.nativeEvent.layout;
		setHeight(height);
		setWidth(width);
	};

	const props = {
		style,
		onLayout,
		imageWidth,
		imageHeight,
		width,
		height,
		markers,
		imageURL,
	};

	return <MapView {...props} />;
}
