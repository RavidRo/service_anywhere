import React, {useContext, useState} from 'react';
import {
	Image,
	LayoutChangeEvent,
	StyleProp,
	Text,
	View,
	ViewStyle,
} from 'react-native';

import {Marker} from './markers/Marker';
import WaiterMarker from './markers/WaiterMarker';
import ClientMarker from './markers/ClientMarker';
import MyZoomableImage from './MyZoomableImage';

import Location from '../data/Location';
import PointOfInterest from '../data/PointOfInterest';

import {OrdersContext} from '../contexts';
import MyLocationViewModel from '../ViewModel/MyLocationViewModel';
import MapsViewModel from '../ViewModel/MapsViewModel';

type MapComponentProps = {
	style?: StyleProp<ViewStyle>;
};

export default function MapComponent({style}: MapComponentProps) {
	//Setting up the markers
	const myLocationViewModel = new MyLocationViewModel();
	const myLocation = myLocationViewModel.getLocation();

	const ordersLocations = useContext(OrdersContext);

	const availableOrders = ordersLocations.filter(
		order => order.location !== undefined
	);

	const guestsMarkers = availableOrders.map(order => [
		new PointOfInterest(order.id, order.location as Location),
		ClientMarker,
	]);

	const waiter = myLocation
		? [new PointOfInterest('Waiter', myLocation), WaiterMarker]
		: undefined;

	const allMarkers = guestsMarkers.concat(waiter ? [waiter] : []) as [
		PointOfInterest,
		Marker
	][];

	// Setting up the image size
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

	return (
		<View style={style} onLayout={onLayout}>
			{imageHeight && imageWidth && width && height ? (
				<MyZoomableImage
					imageHeight={imageHeight}
					imageWidth={imageWidth}
					uri={imageURL}
					pointsOfInterest={allMarkers}
					parentWidth={width}
					parentHeight={height}
				/>
			) : (
				<Text>Loading</Text>
			)}
		</View>
	);
}
