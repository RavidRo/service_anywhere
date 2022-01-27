import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {Marker} from './Marker';

const SIZE = 15;

const WaiterMarker: Marker = ({scale}) => {
	const styles = StyleSheet.create({
		point: {
			width: SIZE * scale,
			height: SIZE * scale,
			borderRadius: (SIZE * scale) / 2,
			backgroundColor: 'blue',
			position: 'absolute',

			borderColor: 'black',
			borderWidth: 2,
		},
		text: {
			position: 'absolute',
			bottom: 0,
			left: 0,
		},
	});

	return (
		<>
			<Text style={styles.text}>Me!</Text>
			<View style={styles.point} />
		</>
	);
};

export default WaiterMarker;
