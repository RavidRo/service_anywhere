import React, {useState} from 'react';
import {Image, Text} from 'react-native';

import ClientMarker from '../components/markers/ClientMarker';
import {Marker} from '../components/markers/Marker';
import PointMarker from '../components/markers/PointMarker';
import WaiterMarker from '../components/markers/WaiterMarker';
import MyZoomableImage from '../components/MyZoomableImage';

import Location from '../data/Location';
import Map from '../data/Map';
import PointOfInterest from '../data/PointOfInterest';

import DummyLocation from '../location_service/DummyLocation';
import {LocationService} from '../location_service/LocationService';

const points: PointOfInterest[] = [
    new PointOfInterest('P1', new Location(0.7, 0.7)),
    new PointOfInterest('P2', new Location(0.3, 0.55)),
];
const map = new Map(
    'https://www.hotelkillarney.ie/upload/slide_images/killarney_maps.jpg',
    {
        bottomLeftGPS: new Location(0, 1),
        bottomRightGPS: new Location(1, 1),
        topRightGPS: new Location(1, 0),
        topLeftGPS: new Location(0, 0),
    },
    points,
);

const locationService: LocationService = new DummyLocation();

const markers = points.map(point => [point, PointMarker]);

type HomeProps = {};
export default function Home(_props: HomeProps) {
    const [myLocation, setMyLocation] = useState<Location>(new Location(0, 0));
    const [clientLocation, _setClientLocation] = useState<Location>(
        new Location(0.5, 0.5),
    );

    const waiter = [new PointOfInterest('Waiter', myLocation), WaiterMarker];
    const client = [
        new PointOfInterest('Client', clientLocation),
        ClientMarker,
    ];

    const markersWithClient = [...markers, client, waiter] as [
        PointOfInterest,
        Marker,
    ][];

    locationService.watchLocation(
        location => setMyLocation(location),
        () => {},
    );

    const [imageWidth, setImageWidth] = useState<number | undefined>();
    const [imageHeight, setImageHeight] = useState<number | undefined>();

    Image.getSize(map.image, (width, height) => {
        setImageWidth(width);
        setImageHeight(height);
    });

    return imageHeight && imageWidth ? (
        <MyZoomableImage
            imageHeight={imageHeight}
            imageWidth={imageWidth}
            uri={map.image}
            pointsOfInterest={markersWithClient}
            myLocation={myLocation}
            clientLocation={clientLocation}
        />
    ) : (
        <Text>Loading</Text>
    );
}
