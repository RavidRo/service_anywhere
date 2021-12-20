import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Marker} from './Marker';

const SIZE = 10;

const WaiterMarker: Marker = ({point, scale}) => {
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
            backgroundColor: 'blue',
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
};

export default WaiterMarker;
