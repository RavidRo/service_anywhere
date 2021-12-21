import {createContext} from 'react';

import Location from './data/Location';
import Order from './data/Order';

export const IDContext = createContext<string | undefined>(undefined);
export const OrdersContext = createContext<Map<Order, Location | undefined>>(
    new Map(),
);
