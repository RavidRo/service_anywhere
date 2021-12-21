import React, {useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';

import Location from '../data/Location';
import Order from '../data/Order';

import {IDContext, OrdersContext} from '../contexts';
import {useAPI} from '../hooks/useApi';

import requests from '../networking/requests';

type OrdersProps = {
    children: Element;
};

const Orders: React.FC<OrdersProps> = ({children}: OrdersProps) => {
    const id = useContext(IDContext);

    const [ordersLocations, setOrdersLocations] = useState<
        Map<Order, Location | undefined>
    >(new Map());

    const {request} = useAPI(requests.getWaiterOrders);
    useEffect(() => {
        if (id) {
            request(id)
                .then(ordersDetails => {
                    const orders = ordersDetails.map(order => new Order(order));
                    setOrdersLocations(
                        new Map(orders.map(order => [order, undefined])),
                    );
                    orders.forEach(order => {
                        order.onNewLocation(newLocation => {
                            setOrdersLocations(ordersLocations => {
                                console.log('WIIII');
                                ordersLocations.set(order, newLocation);
                                return ordersLocations;
                            });
                        });
                    });
                })
                .catch(() => Alert.alert('Could not get orders :('));
        } else {
            Alert.alert('Something went wrong, waiterID is undefined...');
        }
        return () => {
            Array.from(ordersLocations.keys()).forEach(order =>
                order.stopTracking(),
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
