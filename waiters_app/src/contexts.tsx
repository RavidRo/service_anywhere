import {createContext} from 'react';
import Requests from './networking/Requests';
import ConnectionViewModel from './ViewModel/ConnectionViewModel';
import {ItemViewModel} from './ViewModel/ItemViewModel';
import MapViewModel from './ViewModel/MapViewModel';
import MyLocationViewModel from './ViewModel/MyLocationViewModel';
import OrderViewModel from './ViewModel/OrderViewModel';

const requests = new Requests();
const authentication = new ConnectionViewModel(requests);
const orders = new OrderViewModel(requests);
const items = new ItemViewModel(requests);
const maps = new MapViewModel();
const myLocationViewModel = new MyLocationViewModel();

export const ConnectionContext =
	createContext<ConnectionViewModel>(authentication);
export const OrdersContext = createContext<OrderViewModel>(orders);
export const itemsContext = createContext<ItemViewModel>(items);
export const MapsContext = createContext<MapViewModel>(maps);
export const MyLocationContext =
	createContext<MyLocationViewModel>(myLocationViewModel);
