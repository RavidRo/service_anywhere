import React, {useContext} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {MyLocationContext, OrdersContext} from '../contexts';
import {MainPage} from '../View/MainPageView';

//import {observer} from 'mobx-react-lite';

export const MainPageViewController = () => {
	const orderViewModel = useContext(OrdersContext);
	//	const itemViewModel = useContext(itemsContext);
	const locationViewModel = useContext(MyLocationContext);

	// will be changed later to items from itemViewModel
	let items = new Map<string, number>([
		['Item1ID', 1],
		['Item2ID', 1],
	]);

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
	//future signature - SendOrderToServer(items: Map<string, Number>)
	function SendOrderToServer() {
		requestPermissions()
			.then(() => {
				orderViewModel
					.createOrder(items)
					.then(createdOrder => {
						console.log(
							'order created with order id: ' + createdOrder.id
						);
						startWaitingForOrder();
					})
					.catch(err => Alert.alert(err));
			})
			.catch(() => Alert.alert('Please Approve using location'));
	}

	function startWaitingForOrder() {
		locationViewModel.startTracking();
	}
	/*  function waitForOrder(_orderID: String){
        // if(interval.current){
        //   clearInterval(interval.current);
        // }
        //;
        // interval.current = setInterval(() => {hasOrderArrived(_orderID) } , 6000);
        updateLocationGuest(_orderID);
    } */

	const Props = {
		SendOrderToServer: () => SendOrderToServer,
		hasActiveOrder: orderViewModel.hasActiveOrder(),
		orderID: orderViewModel.getOrderId(),
		orderStatus: orderViewModel.getOrderStatus(),
	};

	return <MainPage {...Props} />;
};
