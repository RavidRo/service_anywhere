import React from 'react';
import {useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {MainPage} from '../View/MainPageView';
import OrderViewModel from '../ViewModel/OrderViewModel';

export const MainPageViewController = () => {
	const [waitingForOrder, setWaitingForOrder] = useState(false);
	const order_items = ['bamba', 'Beer'];
	const [orderID, setOrderID] = useState('');

	async function requestPermissions() {
		// if (Platform.OS === 'ios') {
		//   Geolocation.requestAuthorization();
		//   Geolocation.setRNConfiguration({
		//     skipPermissionRequests: false,
		//    authorizationLevel: 'whenInUse',
		//  });
		// }

		if (Platform.OS === 'android') {
			await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
			);
		}
	}

	function SendOrderToServer(items: Map<String, Number>) {
		requestPermissions()
			.then(() => {
				const orderViewModel = new OrderViewModel();
				orderViewModel
					.createOrder(items)
					.then(order_id => {
						console.log('order created with order id: ' + order_id);
						setWaitingForOrder(true);
						setOrderID(order_id);
						//  waitForOrder(order_id)
					})
					.catch(err => Alert.alert(err));
			})
			.catch(() => Alert.alert('Please Approve using location'));
	}

	/*  function waitForOrder(_orderID: String){
        // if(interval.current){
        //   clearInterval(interval.current);
        // }
        //;
        // interval.current = setInterval(() => {hasOrderArrived(_orderID) } , 6000);
        updateLocationGuest(_orderID);
    } */

	// just for testing
	function GotOrder() {
		setWaitingForOrder(false);
		Alert.alert('Order Arrived');
	}

	const Props = {
		SendOrderToServer: SendOrderToServer,
		GotOrder: GotOrder,
		waitingForOrder: waitingForOrder,
		orderID: orderID,
		order_items: order_items,
	};

	return <MainPage {...Props} />;
};
