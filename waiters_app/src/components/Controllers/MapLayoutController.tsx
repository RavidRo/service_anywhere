import React, {useContext, useState} from 'react';
import {Image, LayoutChangeEvent, StyleProp, ViewStyle} from 'react-native';

import MapView from '../Views/MapView';
import {PointMarker} from 'waiters_app/src/map';
import {MapsContext} from 'waiters_app/src/contexts';

type MapLayoutProps = {
	style?: StyleProp<ViewStyle>;
	markers: PointMarker[];
};

export default function MapLayoutController({style, markers}: MapLayoutProps) {
	const mapViewModel = useContext(MapsContext);
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
