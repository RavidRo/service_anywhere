import React, {useContext} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {itemsContext, MyLocationContext, OrdersContext} from '../contexts';
import {MainPage} from '../View/MainPageView';

import {observer} from 'mobx-react-lite';

export const MainPageViewController = observer(() => {
	const orderViewModel = useContext(OrdersContext);
	const itemViewModel = useContext(itemsContext);
	const locationViewModel = useContext(MyLocationContext);

	async function requestPermissions() {
		// if (Platform.OS === 'ios') {
		//   Geolocation.requestAuthorization();
		//   Geolocation.setRNConfiguration({
		//     skipPermissionRequests: false,
		//    authorizationLevel: 'whenInUse',
		//  });
		// }

		// if (Platform.OS === 'android') {
		// 	await PermissionsAndroid.request(
		// 		PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
		// 	);
		// }

		return PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
		);
	}
	//future signature - SendOrderToServer(items: Map<string, Number>)
	async function SendOrderToServer() {
		let itemID1 = itemViewModel.getItems()[0].id;
		console.log('items for order: ', itemViewModel.getItems());
		let items = {[itemID1]: 2};

		requestPermissions()
			.then(response => {
				if (response === PermissionsAndroid.RESULTS.GRANTED) {
					console.log('res - ', response);
					orderViewModel
						.createOrder(items)
						.then(createdOrder => {
							console.log(
								'order created with order id: ' +
									createdOrder.id
							);
							startWaitingForOrder();
						})
						.catch(err =>
							Alert.alert(
								'failed to create order due to ' +
									err.response.data
							)
						);
				} else {
					Alert.alert('Please Approve using location');
				}
			})
			.catch(err => Alert.alert(err));
	}

	function startWaitingForOrder() {
		console.log('start waiting for order');
		// locationViewModel.startTracking();
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
		sendOrderToServer: () => SendOrderToServer,
		hasActiveOrder: orderViewModel.hasActiveOrder(),
		orderID: orderViewModel.getOrderId(),
		orderStatus: orderViewModel.getOrderStatus(),
	};
	function CancelOrder() {
		orderViewModel
			.cancelOrder()
			.then(() => Alert.alert('order canceled succesfully'))
			.catch(err => Alert.alert('failed to cancel order due to: ' + err));
	}
	// return <MainPage {...Props} />;
	return (
		<MainPage
			sendOrderToServer={SendOrderToServer}
			cancelOrder={CancelOrder}
			hasActiveOrder={orderViewModel.hasActiveOrder()}
			orderID={orderViewModel.getOrderId()}
			orderStatus={orderViewModel.getOrderStatus()}
		/>
	);
});
