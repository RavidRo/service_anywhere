import {createContext} from 'react';
import Requests from './networking/Requests';
import ConnectionViewModel from './ViewModel/ConnectionViewModel';
import {ItemViewModel} from './ViewModel/ItemViewModel';
import MapViewModel from './ViewModel/MapViewModel';
import MyLocationViewModel from './ViewModel/MyLocationViewModel';
import OrderViewModel from './ViewModel/OrderViewModel';

const requests = new Requests();
const items = new ItemViewModel(requests);
const orders = new OrderViewModel(requests, items);
const myLocation = new MyLocationViewModel(requests, items);
const authentication = new ConnectionViewModel(
	requests,
	orders,
	items,
	myLocation
);
const maps = new MapViewModel();

export const ConnectionContext =
	createContext<ConnectionViewModel>(authentication);
export const OrdersContext = createContext<OrderViewModel>(orders);
export const itemsContext = createContext<ItemViewModel>(items);
export const MapsContext = createContext<MapViewModel>(maps);
export const MyLocationContext = createContext<MyLocationViewModel>(myLocation);
