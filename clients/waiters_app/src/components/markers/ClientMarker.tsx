import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Marker} from './Marker';

const SIZE = 40;

const ClientMarker: Marker = ({point, scale}) => {
    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            top: point.location.x,
            left: point.location.y,
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
};

export default ClientMarker;
