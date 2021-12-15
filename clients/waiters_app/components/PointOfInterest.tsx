import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Poi} from '../data/types';

type PointOfInterestProps = {
    point: Poi;
    scale: number;
};

const SIZE = 10;

export default function PointOfInterest({point, scale}: PointOfInterestProps) {
    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            top: point.location.y,
            left: point.location.x,

            width: SIZE * scale,
            height: SIZE * scale,
            borderRadius: (SIZE * scale) / 2,
            backgroundColor: 'red',

            zIndex: 1,
            elevation: 1,
        },
    });

    return <View style={styles.container} />;
}
