import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {Marker} from './Marker';

const SIZE = 40;

const ClientMarker: Marker = ({scale, name}) => {
    const styles = StyleSheet.create({
        point: {
            width: SIZE * scale,
            height: SIZE * scale,
            borderRadius: (SIZE * scale) / 2,
            backgroundColor: 'orange',
            position: 'absolute',
        },
        text: {
            // width: 50,
            position: 'absolute',
            bottom: 0,
            left: 0,
        },
    });

    return (
        <>
            <Text style={styles.text}>{name}</Text>
            <View style={styles.point} />
        </>
    );
};

export default ClientMarker;
