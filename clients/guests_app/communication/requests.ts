import axios from 'axios';
import React, { useRef, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import Location, {OrderID} from './types';
import Gps from './LocationService';
import Map from './mapScaling'


const server_adress = "https://service-everywhere.herokuapp.com"
const service = new Gps();
const corners = { topRightGPS: new Location(34.802516, 31.263550),
                  topLeftGPS: new Location(34.800838, 31.263550), 
                  bottomRightGPS: new Location(34.802516, 31.261649),
                  bottomLeftGPS: new Location(34.800838, 31.261649)}

// topLeft: 31.263550, 34.800838
// topRight:  31.263550, 34.802516
// bottomLeft: 31.261649, 34.800838
// bottomRight: 31.261649, 34.802516

export function updateLocationGuest (orderID: OrderID) {
    const url = `${server_adress}/updateLocationGuest`;
    service.watchLocation((location) => {
        console.log("X cordinate from location service: " + location.x)
        console.log("Y cordinate from location service: " + location.y)
        const mapScaling = new Map('Default Map', corners);
        const newLocation: Location = mapScaling.translateGps(location);
        console.log("X cordinate from translated: " + newLocation.x)
        console.log("Y cordinate from translated: " + newLocation.y)
        axios({
            method: 'POST',
            url: url,
            data:{
                'location': {
                    'x': newLocation.x,
                    'y': newLocation.y 
                },
                'orderID': orderID
            }
        }).then( (res)=> console.log(res.status))
        .catch((err) => console.log("update Location guest error - " + err))
    },
    (err) => console.log("get location eror - " + err))
  }

export function createOrder(order_items: String[])
{
    const url = `${server_adress}/createOrder`;
    return axios({
      method: "post",
      url: url,
      data:{
        'items': order_items
      }
    })
}
export function hasOrderArrived(orderID: String)
{
    const url = `${server_adress}/hasOrderArrived`;
    return axios({
      method: "get",
      url: url,
      params: {
        'orderID': orderID
      }
    })
}