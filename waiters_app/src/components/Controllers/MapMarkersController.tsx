import React, {useContext} from 'react';
import {StyleProp, ViewStyle} from 'react-native';

import {observer} from 'mobx-react-lite';
import {Location} from 'waiters_app/src/ido';

import WaiterMarker from '../Views/markers/WaiterMarker';
import GuestMarker from '../Views/markers/ClientMarker';

import MapLayoutController from './MapLayoutController';
import {PointMarker} from 'waiters_app/src/map';
import {MyLocationContext, OrdersContext} from 'waiters_app/src/contexts';

type MapMarkerControllerProps = {
	style?: StyleProp<ViewStyle>;
};

function createGuestMarker(myLocation?: Location): PointMarker | undefined {
	if (!myLocation) {
		return undefined;
	}

	const myLocationPoint = {name: 'Waiter', location: myLocation};
	return {point: myLocationPoint, marker: WaiterMarker};
}

const MapMarkersController = observer(({style}: MapMarkerControllerProps) => {
	const ordersViewModel = useContext(OrdersContext);

	//Guests Markers
	const guestsMarkers = ordersViewModel.availableOrders.map(
		({order, location}) => ({
			point: {
				name: order.id,
				location,
			},
			marker: GuestMarker,
		})
	);

	//Waiter Marker
	const myLocationViewModel = useContext(MyLocationContext);
	const waiterMarker = createGuestMarker(myLocationViewModel.location);

	const allMarkers = guestsMarkers.concat(waiterMarker ? [waiterMarker] : []);

	return <MapLayoutController markers={allMarkers} style={style} />;
});

export default MapMarkersController;
