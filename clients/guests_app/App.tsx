/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import axios from 'axios';
import React, { useRef, useState } from 'react';
import {Alert, Button, SafeAreaView, StatusBar, StyleSheet, useColorScheme} from 'react-native';
import { ActivityIndicator, Text, View } from "react-native";
import { FlatGrid, SectionGrid } from 'react-native-super-grid';
import {createOrder, hasOrderArrived, updateLocationGuest} from './requests';


import { Platform, PermissionsAndroid } from 'react-native';

import Geolocation from 'react-native-geolocation-service';


const App = () => {
  const interval = useRef<NodeJS.Timer>();

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
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  }


  function SendOrderToServer(items: String[])
  {
    requestPermissions();
    createOrder(items).then((res) => {
        console.log("create order response: " + res.data)
        if (res.data) {
          setWaitingForOrder(true)
          setOrderID(res.data)
          waitForOrder(res.data)
        } 
      }).catch((err) =>{console.log(err); Alert.alert(`failed to send order due to ${err}`) } )
  }
  
  function checkOrderArrived(orderID: String) {
    hasOrderArrived(orderID).then((res) => {
        console.log("has order arrived response:" + res.data)
        if(res.data){
          if(interval.current){
            clearInterval(interval.current);
            interval.current = undefined;
          }
          setWaitingForOrder(false)
          orderArrived();
        }
        return res.data;
      }).catch((err) => {console.log("hasOrderArrived error: " + err); Alert.alert(`failed to send order due to ${err}`)})
  }
  
   // asks server if order has arrived every __ seconds until receiving positive response
  // posts the guest's location 
  function waitForOrder(_orderID: String){
    // if(interval.current){
    //   clearInterval(interval.current);
    // }
    //;
    // interval.current = setInterval(() => {hasOrderArrived(_orderID) } , 6000);
    updateLocationGuest(_orderID);
  }

  function orderArrived(){
     Alert.alert("Order Arrived, disfrute de su comida Mi Hermano");
  }

  const [waitingForOrder, setWaitingForOrder] = useState(false);
  const order_items = ['bamba', 'Beer'];
  const [orderID, setOrderID] = useState('');

  
  // just for testing
  function GotOrder() {
    if(interval.current){
      clearInterval(interval.current);
      interval.current = undefined;
    }
    Alert.alert("Bonne Appetit :)");
    setWaitingForOrder(false)
  }
  

    return (
      
        <SafeAreaView style={styles.safeAreaView}>
          <View style={styles.FlatGrid}>
            <Button title="Order" onPress={() => {SendOrderToServer(order_items);} }/>
            <Button title="Got My Order" onPress={() => {GotOrder();} } />
                
              {waitingForOrder?
            <View style={[styles.container, styles.horizontal]}>
                <View>
                  <Text>Order in progres.. {"\n"}
                        order id = {orderID}
                  </Text>
                  <ActivityIndicator size="large" color="#00ff00" />
                </View>
            </View>
                : <></> }
          </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      position: "absolute",
      bottom: '26%',
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
    },
    safeAreaView:{
      height: '100%'
    },
    FlatGrid:{
      height: '100%',
      // backgroundColor: 'blue',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    }
  });


export default App;
