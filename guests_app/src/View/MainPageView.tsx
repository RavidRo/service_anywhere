import React from 'react';
import {
	ActivityIndicator,
	Button,
	SafeAreaView,
	Text,
	View,
} from 'react-native';

export const MainPage = (props: any) => {
	return (
		<SafeAreaView>
			<Button
				title='Order'
				onPress={() => {
					props.SendOrderToServer(props.order_items);
				}}
			/>

			{/*just for testing */}
			<Button
				title='Got My Order'
				onPress={() => {
					props.GotOrder();
				}}
			/>

			{props.order != null ? (
				<View>
					<Text>
						Order in progress...\n order id = {props.order.order_id}
					</Text>
					<ActivityIndicator size='large' color='#00ff00' />
				</View>
			) : (
				<></>
			)}
		</SafeAreaView>
	);
};
