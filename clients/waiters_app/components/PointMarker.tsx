import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import PointOfInterest from '../data/PointOfInterest';

type PointMarkerProps = {
    point: PointOfInterest;
    scale: number;
};

const SIZE = 10;

export default function PointMarker({point, scale}: PointMarkerProps) {
    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            top: point.location.y,
            left: point.location.x,
            zIndex: 1,
        },
        point: {
            width: SIZE * scale,
            height: SIZE * scale,
            borderRadius: (SIZE * scale) / 2,
            backgroundColor: 'red',
            position: 'absolute',
        },
        text: {
            width: 50,
            position: 'absolute',
            bottom: SIZE * scale,
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{point.name}</Text>
            <View style={styles.point} />
        </View>
    );
}
