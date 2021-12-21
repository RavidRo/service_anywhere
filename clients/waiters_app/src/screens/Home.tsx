import React, {useRef} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import MapComponent from '../components/MapComponent';
import OrdersList from '../components/OrdersList';

import Location from '../data/Location';
import Map from '../data/Map';
import PointOfInterest from '../data/PointOfInterest';

const points: PointOfInterest[] = [
    new PointOfInterest('P1', new Location(0.7, 0.7)),
    new PointOfInterest('P2', new Location(0.3, 0.55)),
];
const map = new Map(
    'https://www.hotelkillarney.ie/upload/slide_images/killarney_maps.jpg',
    {
        bottomLeftGPS: new Location(0, 1),
        bottomRightGPS: new Location(1, 1),
        topRightGPS: new Location(1, 0),
        topLeftGPS: new Location(0, 0),
    },
    points,
);

type HomeProps = {};
export default function Home(_props: HomeProps) {
    const refRBSheet = useRef<any>();

    return (
        <>
            <View style={styles.screen}>
                <MapComponent style={styles.map} map={map} />
                <View style={styles.openDrawerButton}>
                    <Button
                        title="Order"
                        onPress={() => refRBSheet.current.open()}
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
