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
import React, { useState } from 'react';
import {Alert, Button, SafeAreaView, StatusBar, StyleSheet, useColorScheme} from 'react-native';
import { ActivityIndicator, Text, View } from "react-native";

import {Colors} from 'react-native/Libraries/NewAppScreen';
import ImageView from './Components/ImageView';

// const url = `${base_route}/enter`;
// return axios({
//   method: "post",
//   url: url,
// }).then((res) => {
//   if (res.data.status) {
//     return res.data
//   } else {
//     throw new Error(res.data.description)
//   }
// }).catch((err) => alert(`failed to enter the system due to ${err}`))

const base_route = "server_adress";
function SendOrderToServer(items: String[])
{
  const url = `${base_route}/order`;
  return axios({
    method: "post",
    url: url,
  }).then((res) => {
      if (res.data.status) {
        return res.data
      } else {
        throw new Error(res.data.description)
      }
    }).catch((err) => Alert.alert(`failed to send order due to ${err}`))
}
const App = () => {
      
    const [orderInProgress, setOrderInProgress] = useState(false);

      
    async function SendOrder() {
      // if (await SendOrderToServer([])) {
      //    Alert.alert("Order Sent!");
      //    setOrderInProgress(true)
      // }
      Alert.alert("Order Sent!");
      setOrderInProgress(true)
    }
    function GotOrder() {
      const x = 1;
      Alert.alert("Bonne Appetit :)");
      setOrderInProgress(false)
    }

    return (
        <SafeAreaView>
       
        <Button 
          title="Order"

           onPress={() => {SendOrder();} }
          />
        <Button
          title="Got My Order"

           onPress={() => {GotOrder();} }
          />

          <View style={[styles.container, styles.horizontal]}>
            {/* <ActivityIndicator />
            <ActivityIndicator size="large" />
            <ActivityIndicator size="small" color="#0000ff" /> */}
            {/* <ActivityIndicator size="large" color="#00ff00" /> */}
            {orderInProgress?
              <View>
              <ActivityIndicator size="large" color="#00ff00" />
  
              </View>
              : <></> }
            
          </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center"
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
    }
  });


export default App;
