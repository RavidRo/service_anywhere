import axios, {AxiosResponse} from 'axios';

import {Order as OrderApi, Location as LocationApi} from '../data/api';
import Location from '../data/Location';

const axiosInstance = axios.create({
    baseURL: 'https://service-everywhere.herokuapp.com/',
});

// topLeft: 31.263550, 34.800838
// topRight:  31.263550, 34.802516
// bottomLeft: 31.261649, 34.800838
// bottomRight: 31.261649, 34.802516

function request<T>(endPoint: string, params: object, GET = true) {
    console.debug(`Request ${endPoint}`, params);

    const request = GET ? axiosInstance.get : axiosInstance.post;
    return request(`${endPoint}`, GET ? {params} : params)
        .then(response => handleResponse<T>(response))
        .catch(e => {
            console.debug(e);
            return Promise.reject(e);
        });
}

function handleResponse<T>(response: AxiosResponse<T>) {
    if (response.status === 200) {
        const data = response.data;
        console.debug('The server response', data);
        return Promise.resolve(data);
    } else {
        console.debug(`HTTP Error - ${response.status}`);
        return Promise.reject(`HTTP Error - ${response.status}`);
    }
}

function get<T>(endPoint: string, params = {}) {
    return request<T>(endPoint, params);
}
function post<T>(endPoint: string, params = {}) {
    return request<T>(endPoint, params, false);
}

function getGuestLocation(orderID: string) {
    // TODO: location can be undefined...
    return get<LocationApi>('getGuestLocation', {orderID}).then(location => {
        if (!location.x || !location.y) {
            return Promise.reject('Location is not in the right format');
        }
        return new Location(location.x, location.y);
    });
}

function getWaiterOrders(waiterID: string) {
    // return get<OrderApi[]>('getWaiterOrders', {waiterID});
    return get<OrderApi[]>('getWaiterOrders', {
        waiterID: '8778c0db-4f1c-4ee2-b158-379c780d24ec',
    });
}

function orderArrived(orderID: string) {
    return post<void>('orderArrived', {orderID});
}

function connectWaiter() {
    return post<string>('connectWaiter');
}

// function getGuestLocation(..._params: [orderID: string]): Promise<Location> {
//     return new Promise(resolve => resolve(new Location(0.2, 0.2)));
// }

// function getWaiterOrders(..._params: [waiterID: string]): Promise<OrderApi[]> {
//     return new Promise(resolve =>
//         resolve([
//             {
//                 id: 'OmerID',
//                 items: ['Item1', 'Item2'],
//                 status: 'inprogress',
//             },
//             {
//                 id: 'AvivID',
//                 items: ['Item1', 'Item2'],
//                 status: 'inprogress',
//             },
//             {
//                 id: 'TommerID',
//                 items: ['Item1', 'Item2'],
//                 status: 'inprogress',
//             },
//         ]),
//     );
// }

// function orderArrived(..._params: [orderID: string]): Promise<void> {
//     return new Promise(resolve => resolve());
// }

// function login(..._params: []): Promise<string> {
//     return new Promise(resolve => resolve('MYID'));
// }

export default {
    getGuestLocation,
    getWaiterOrders,
    orderArrived,
    login: connectWaiter,
};
