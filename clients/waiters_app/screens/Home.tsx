import React from 'react';
import {Image} from 'react-native';
import MyZoomableImage from '../components/MyZoomableImage';
import Location from '../data/Location';
import PointOfInterest from '../data/PointOfInterest';

const points: PointOfInterest[] = [
    new PointOfInterest('P1', new Location(0.7, 0.7)),
];

type HomeProps = {};

const map = require('../images/map.jpg');
const {width: image_width, height: image_height} =
    Image.resolveAssetSource(map);

export default function home(_: HomeProps) {
    return (
        <MyZoomableImage
            imageHeight={Math.max(image_height)}
            imageWidth={Math.max(image_width)}
            source={map}
            pointsOfInterest={points}
        />
    );
}

// const styles = StyleSheet.create({
//     container: {},
// });
