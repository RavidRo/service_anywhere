import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {Marker} from './Marker';

const SIZE = 20;

const PointMarker: Marker = ({scale, name}) => {
    const styles = StyleSheet.create({
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
        <>
            <Text style={styles.text}>{name}</Text>
            <View style={styles.point} />
        </>
    );
};

export default PointMarker;
