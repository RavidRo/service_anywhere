import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Location} from '../../data/types';

type PointMarkerProps = {
    point: Location;
    scale: number;
};

const SIZE = 10;

export default function PointMarker({point, scale}: PointMarkerProps) {
    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            top: point.y,
            left: point.x,
            zIndex: 1,
        },
        point: {
            width: SIZE * scale,
            height: SIZE * scale,
            borderRadius: (SIZE * scale) / 2,
            backgroundColor: 'green',
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
            <View style={styles.point} />
        </View>
    );
}
