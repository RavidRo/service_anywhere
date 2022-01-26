import {createContext} from 'react';
import Order from './Models/Order';

export const IDContext = createContext<string | undefined>(undefined);

export const OrdersContext = createContext<Order[]>([]);
