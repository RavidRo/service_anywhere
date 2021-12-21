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


const server_adress = ""
const server_port = ""
const base_route = server_adress + ':' + server_port;

function SendOrderToServer(items: String[])
{
  const url = `${base_route}/createOrder`;
  return axios({
    method: "post",
    url: url,
  }).then((res) => {
      console.log("response: " + res)
      if (res.data) {
        waitForOrder(res.data)
      } 
    }).catch((err) => Alert.alert(`failed to send order due to ${err}`))
}

// asks server if order has arrived every 5 seconds until receiving positive response
function waitForOrder(orderId: String){

    // while(!hasOrderArrived(orderId))
    // {
    //   wait(5)
    // }
   setWaitingForOrder(false)
}

// sending "hasOrderArrived" get request
function hasOrderArrived(orderId: String) {
  const url = `${base_route}/hasOrderArrived`;
  return axios({
    method: "get",
    url: url,
  }).then((res) => {
      console.log("hasOrderArrived response: " + res)
      return res.data;
    }).catch((err) => Alert.alert(`failed to send order due to ${err}`))
}

// function just to check connection with server
function GetHomePage()
{
  axios.get(base_route)
  .then(function(response) {
       Alert.alert("got server home: "  + response)
      // handle response
  }).catch(function(error) {
      // handle error
      Alert.alert(`failed to send order due to ${error}`)
  }).finally(function() {
      // always executes at the last of any API call
  });
} 


const [waitingForOrder, setWaitingForOrder] = useState(false);
const order_items = ['bamba', 'Beer'];

function GotOrder() {
  const x = 1;
  Alert.alert("Bonne Appetit :)");
  setWaitingForOrder(false)
}

const App = () => {

    return (
        <SafeAreaView>
       
          <Button title="Order" onPress={() => {SendOrderToServer(order_items);} }/>

          {/* will be romoved*/}
          <Button title="Got My Order" onPress={() => {GotOrder();} } />

          {/* will be romoved, just for checking connection with server */}
          <Button title="Get Server Home Page" onPress={() => {GetHomePage();} }/>
          
            <View style={[styles.container, styles.horizontal]}>
              {waitingForOrder?
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
