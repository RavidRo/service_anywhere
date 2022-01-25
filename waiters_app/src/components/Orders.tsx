import React, {useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';

import Location from '../data/Location';
import Order from '../data/Order';

import {IDContext, OrdersContext} from '../contexts';
import {useAPI} from '../hooks/useApi';

import requests from '../networking/requests';

const Orders: React.FC = ({children}) => {
	const id = useContext(IDContext);

	const [ordersLocations, setOrdersLocations] = useState<{
		[orderID: string]: [Order, Location | undefined];
	}>({});

	const {request} = useAPI(requests.getWaiterOrders);
	useEffect(() => {
		if (id) {
			request(id)
				.then(ordersDetails => {
					const orders = ordersDetails.map(order => new Order(order));
					setOrdersLocations(() =>
						orders.reduce(
							(o, order) => ({
								...o,
								[order.id]: [order, undefined],
							}),
							{}
						)
					);
					orders.forEach(order => {
						order.onNewLocation(newLocation => {
							if (newLocation && newLocation.x && newLocation.y) {
								setOrdersLocations(ordersLocations2 => {
									console.log('Guest location:', newLocation);
									return {
										...ordersLocations2,
										[order.id]: [order, newLocation],
									};
								});
							} else {
								console.debug(
									'New guest location was not goodi :(',
									newLocation
								);
							}
						});
					});
				})
				.catch(() => Alert.alert('Could not get orders :('));
		} else {
			Alert.alert('Something went wrong, waiterID is undefined...');
		}
		return () => {
			Array.from(Object.values(ordersLocations)).forEach(([order, _]) =>
				order.stopTracking()
			);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);
	return (
		<OrdersContext.Provider value={ordersLocations}>
			{children}
		</OrdersContext.Provider>
	);
};

export default Orders;
