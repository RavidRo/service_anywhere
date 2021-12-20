import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Marker} from './Marker';

const SIZE = 20;

const PointMarker: Marker = ({point, scale}) => {
    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            top: point.location.y,
            left: point.location.x,
            zIndex: 1,
        },
        point: {
            position: 'absolute',

            width: SIZE * scale,
            height: SIZE * scale,

            borderRadius: (SIZE * scale) / 2,
            backgroundColor: 'red',
            borderColor: 'black',
            borderWidth: 2,
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
};

export default PointMarker;
