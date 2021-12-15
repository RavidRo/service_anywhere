import React from 'react';
import {Image} from 'react-native';
import MyZoomableImage from '../components/MyZoomableImage';
// import {StyleSheet} from 'react-native';

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
            // order={}
        />
    );
}

// const styles = StyleSheet.create({
//     container: {},
// });
