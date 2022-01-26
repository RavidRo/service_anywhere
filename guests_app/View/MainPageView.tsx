import React from "react";
import { ActivityIndicator, Button, SafeAreaView, Text, View } from "react-native";

export const MainPage = (props: any) => {   
    return (
        <SafeAreaView>
            <Button title="Order" onPress={() => {props.SendOrderToServer(props.order_items);} }/>
            <Button title="Got My Order" onPress={() => {props.GotOrder();} } />
                
            {props.waitingForOrder? 
                <View> 
                    <Text>Order in progres.. {"\n"} order id = {props.orderID} </Text> 
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            : <></> }
        </SafeAreaView>
    );
}