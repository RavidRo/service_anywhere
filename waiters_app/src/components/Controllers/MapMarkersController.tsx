import React, {useContext} from 'react';
import {StyleProp, ViewStyle} from 'react-native';

import WaiterMarker from '../Views/markers/WaiterMarker';
import GuestMarker from '../Views/markers/ClientMarker';

import {IDContext} from '../../contexts';
import MyLocationViewModel from '../../ViewModel/MyLocationViewModel';

import MapLayoutController from './MapLayoutController';
import OrdersViewModel from 'waiters_app/src/ViewModel/OrdersViewModel';
import {PointMarker, PointOfInterest} from 'waiters_app/src/map';
import {observer} from 'mobx-react-lite';

type MapMarkerControllerProps = {
	style?: StyleProp<ViewStyle>;
};

function createGuestMarker(): PointMarker | undefined {
	const myLocationViewModel = new MyLocationViewModel();
	const myLocation = myLocationViewModel.getLocation();
	if (!myLocation) {
		return undefined;
	}

	const myLocationPoint = {name: 'Waiter', location: myLocation};
	return {point: myLocationPoint, marker: WaiterMarker};
}

const MapMarkersController = observer(({style}: MapMarkerControllerProps) => {
	const id = useContext(IDContext);
	if (!id) {
		console.error('id is not initialized in the Map component');
		return <></>;
	}

	//Guests Markers
	const ordersViewModel = new OrdersViewModel(id);
	const availableOrders = ordersViewModel.availableOrders;
	const availableOrdersPoints = availableOrders.map(order => ({
		name: order.id,
		location: order.location as Location,
	}));

	const orderToMarker = (order: PointOfInterest): PointMarker => ({
		point: order,
		marker: GuestMarker,
	});
	const guestsMarkers = availableOrdersPoints.map(orderToMarker);

	//Waiter Marker
	const waiterMarker = createGuestMarker();

	const allMarkers = guestsMarkers.concat(waiterMarker ? [waiterMarker] : []);

	return <MapLayoutController markers={allMarkers} style={style} />;
});

export default MapMarkersController;
