import {createContext} from 'react';
import Requests from './networking/Requests';
import ConnectionViewModel from './ViewModel/AuthenticateViewModel';
import {ItemsViewModel} from './ViewModel/ItemsViewModel';
import MapsViewModel from './ViewModel/MapsViewModel';
import MyLocationViewModel from './ViewModel/MyLocationViewModel';
import OrdersViewModel from './ViewModel/OrdersViewModel';

const requests = new Requests();
const authentication = new ConnectionViewModel(requests);
const orders = new OrdersViewModel(requests);
const items = new ItemsViewModel(requests);
const maps = new MapsViewModel();
const myLocationViewModel = new MyLocationViewModel();

export const ConnectionContext =
	createContext<ConnectionViewModel>(authentication);
export const OrdersContext = createContext<OrdersViewModel>(orders);
export const itemsContext = createContext<ItemsViewModel>(items);
export const MapsContext = createContext<MapsViewModel>(maps);
export const MyLocationContext =
	createContext<MyLocationViewModel>(myLocationViewModel);
