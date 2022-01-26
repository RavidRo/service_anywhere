import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import MapComponent from '../MapComponent';
import PointOfInterest from '../../data/PointOfInterest';
import OrdersListController from '../Controllers/OrdersListController';

type MapScreenViewProps = {
	openBottomSheet: () => void;
	refBottomSheet: React.MutableRefObject<unknown>;
};
export default function MapScreenView(props: MapScreenViewProps): JSX.Element {
	return (
		<>
			<View style={styles.screen}>
				<MapComponent style={styles.map} />
				<View style={styles.openDrawerButton}>
					<Button title='Order' onPress={props.openBottomSheet} />
				</View>
				<RBSheet
					ref={props.refBottomSheet}
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
					<OrdersListController />
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
