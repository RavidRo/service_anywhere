import React, { useState } from 'react';
import {Image} from 'react-native';
import MyZoomableImage from '../components/MyZoomableImage';
import Location from '../data/Location';
import PointOfInterest from '../data/PointOfInterest';
import useInterval from '../hooks/useInterval';

const points: PointOfInterest[] = [
    new PointOfInterest('P1', new Location(0.7, 0.7)),
];

type HomeProps = {};

const map = require('../images/map.jpg');
const {width: image_width, height: image_height} =
    Image.resolveAssetSource(map);

export default function home(_: HomeProps) {
    const [myLocation, setMyLocation] = useState<Location>(new Location(0,0));
    const [clientLocation, setClientLocation] = useState<Location>(new Location(1,1));
    useInterval(() => setMyLocation(new Location(myLocation.x +  0.01, myLocation.y + 0.01)), 500);
    return (
        <MyZoomableImage
            imageHeight={Math.max(image_height)}
            imageWidth={Math.max(image_width)}
            source={map}
            pointsOfInterest={points}
            myLocation={myLocation}
            clientLocation={clientLocation}
        />
    );
}

// const styles = StyleSheet.create({
//     container: {},
// });
