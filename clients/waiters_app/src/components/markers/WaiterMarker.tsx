import React from 'react';
import {View, StyleSheet} from 'react-native';

import {Marker} from './Marker';

const SIZE = 40;

const WaiterMarker: Marker = ({scale}) => {
    const styles = StyleSheet.create({
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

    return <View style={styles.point} />;
};

export default WaiterMarker;
