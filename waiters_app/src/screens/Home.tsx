import React, {useRef} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import MapComponent from '../components/MapComponent';
import OrdersList from '../components/OrdersList';

import Location from '../data/Location';
import Map from '../data/Map';
import PointOfInterest from '../data/PointOfInterest';

const points: PointOfInterest[] = [
	// new PointOfInterest('P1', new Location(0.7, 0.7)),
	// new PointOfInterest('P2', new Location(0.3, 0.55)),
];

const map = new Map(
	'https://res.cloudinary.com/noa-health/image/upload/v1640287601/bengurion-map_q32yck.png',
	{
		bottomRightGPS: new Location(34.802516, 31.261649),
		bottomLeftGPS: new Location(34.800838, 31.261649),
		topRightGPS: new Location(34.802516, 31.26355),
		topLeftGPS: new Location(34.800838, 31.26355),
	},
	points
);

interface RefObject {
	open: () => void;
}
export default function Home(_props: Record<string, unknown>): JSX.Element {
	const refRBSheet = useRef<RefObject>();

	return (
		<>
			<View style={styles.screen}>
				<MapComponent style={styles.map} map={map} />
				<View style={styles.openDrawerButton}>
					<Button
						title='Order'
						onPress={() => refRBSheet.current?.open()}
					/>
				</View>
				<RBSheet
					ref={refRBSheet}
					closeOnDragDown={true}
					closeOnPressMask={false}
					customStyles={{
						wrapper: {
							backgroundColor: 'transparent',
						},
						draggableIcon: {
							backgroundColor: '#000',
						},
					}}>
					<OrdersList />
				</RBSheet>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	screen: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
	},
	map: {
		height: '95%',
	},
	openDrawerButton: {
		flexGrow: 1,
		// height: 50,
		// bottom: 0,
		// position: 'relative',
	},
});
