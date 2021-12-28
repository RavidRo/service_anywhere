import React, {useContext, useEffect, useState} from 'react';
import {Alert, Image, StyleProp, Text, View, ViewStyle} from 'react-native';

import {Marker} from './markers/Marker';
import PointMarker from './markers/PointMarker';
import WaiterMarker from './markers/WaiterMarker';
import ClientMarker from './markers/ClientMarker';
import MyZoomableImage from './MyZoomableImage';

import Location from '../data/Location';
import Map from '../data/Map';
import PointOfInterest from '../data/PointOfInterest';
import Order from '../data/Order';

// import DummyLocation from '../location_services/DummyLocation';
import {LocationService} from '../location_services/LocationService';

import {OrdersContext} from '../contexts';
import Geolocation from '../location_services/Geolocation';

const myLocationService: LocationService = new Geolocation();

type MapComponentProps = {
    style: StyleProp<ViewStyle>;
    map: Map;
};
export default function MapComponent({style, map}: MapComponentProps) {
    const [myLocation, setMyLocation] = useState<Location>();
    const ordersLocations = useContext(OrdersContext);
    useEffect(() => {
        myLocationService.watchLocation(
            location => {
                const localLocation = map.translateGps(location);
                console.log('My location:', localLocation);
                setMyLocation(localLocation);
            },
            () => {
                Alert.alert("Can't find your location", 'Your GPS is on?');
            },
        );
        return () => myLocationService.stopWatching();
    }, [map]);

    const available = Object.values(ordersLocations).filter(
        ([_, location]) => location,
    ) as [Order, Location][];
    console.log(
        'My visual locations',
        myLocation,
        // Object.values(available).map(([_, location]) => location),
    );
    const guestsMarkers = available.map(([order, location]) => [
        new PointOfInterest(order.id, location),
        ClientMarker,
    ]);
    // const guestsMarkers: [PointOfInterest, Marker][] = [];
    const markers = map.points.map(point => [point, PointMarker]);
    const waiter = myLocation
        ? [new PointOfInterest('Waiter', myLocation), WaiterMarker]
        : undefined;

    const allMarkers = markers
        .concat(guestsMarkers)
        .concat(waiter ? [waiter] : []) as [PointOfInterest, Marker][];

    const [imageWidth, setImageWidth] = useState<number | undefined>();
    const [imageHeight, setImageHeight] = useState<number | undefined>();
    const [width, setWidth] = useState<number | undefined>();
    const [height, setHeight] = useState<number | undefined>();

    Image.getSize(map.image, (width, height) => {
        setImageWidth(width);
        setImageHeight(height);
    });

    return (
        <View
            style={style}
            onLayout={event => {
                const {height, width} = event.nativeEvent.layout;
                setHeight(height);
                setWidth(width);
            }}>
            {imageHeight && imageWidth && width && height ? (
                <MyZoomableImage
                    imageHeight={imageHeight}
                    imageWidth={imageWidth}
                    uri={map.image}
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
