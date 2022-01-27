import React, {useContext} from 'react';
import {StyleProp, ViewStyle} from 'react-native';

import {Marker} from '../markers/Marker';
import WaiterMarker from '../markers/WaiterMarker';
import ClientMarker from '../markers/ClientMarker';

import Location from '../../data/Location';
import PointOfInterest from '../../data/PointOfInterest';

import {OrdersContext} from '../../contexts';
import MyLocationViewModel from '../../ViewModel/MyLocationViewModel';

import MapLayoutController from './MapLayoutController';

type MapComponentProps = {
	style?: StyleProp<ViewStyle>;
};

export default function MapMarkersController({style}: MapComponentProps) {
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

	return <MapLayoutController markers={allMarkers} style={style} />;
}
