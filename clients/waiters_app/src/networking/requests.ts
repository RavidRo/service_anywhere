import axios, {AxiosResponse} from 'axios';

import {Order as OrderApi, Location as LocationApi} from '../data/api';
import Location from '../data/Location';

const axiosInstance = axios.create({baseURL: 'http://localhost/'});

function request<T>(endPoint: string, params: object, GET = true) {
    console.debug(`Request ${endPoint}`, params);

    const request = GET ? axiosInstance.get : axiosInstance.post;
    return request(`${endPoint}`, GET ? {params} : params).then(response =>
        handleResponse<T>(response),
    );
}

function handleResponse<T>(
    response: AxiosResponse<{
        cookie: string;
        error_msg: string;
        succeeded: boolean;
        data: T;
    }>,
) {
    if (response.status === 200) {
        const data = response.data;
        console.debug('The server response', data);

        if (!data.succeeded) {
            return Promise.reject(data.error_msg);
        }
        return Promise.resolve(data.data);
    } else {
        return Promise.reject(`HTTP Error - ${response.status}`);
    }
}

function get<T>(endPoint: string, params = {}) {
    return request<T>(endPoint, params);
}
function post<T>(endPoint: string, params = {}) {
    return request<T>(endPoint, params, false);
}

// function getGuestLocation(...params: [orderID: string]) {
//     return get<LocationApi>('getGuestLocation', params).then(
//         location => new Location(location.x, location.y),
//     );
// }

// function getWaiterOrders(...params: [waiterID: string]) {
//     return get<OrderApi[]>('getWaiterOrders', params).then(orders =>
//         orders.map(order => new Order(order)),
//     );
// }

// function orderArrived(...params: [orderID: string]) {
//     return post<void>('orderArrived', params);
// }

// function login(...params: []) {
//     return post<string>('login', params);
// }

function getGuestLocation(..._params: [orderID: string]): Promise<Location> {
    return new Promise(() => new Location(0.4, 0.4));
}

function getWaiterOrders(..._params: [waiterID: string]): Promise<OrderApi[]> {
    return new Promise(resolve =>
        resolve([
            {
                id: 'OmerID',
                items: ['Item1', 'Item2'],
                status: 'inprogress',
            },
            {
                id: 'AvivID',
                items: ['Item1', 'Item2'],
                status: 'inprogress',
            },
            {
                id: 'TommerID',
                items: ['Item1', 'Item2'],
                status: 'inprogress',
            },
        ]),
    );
}

function orderArrived(..._params: [orderID: string]): Promise<void> {
    return new Promise(resolve => resolve());
}

function login(..._params: []): Promise<string> {
    return new Promise(resolve => resolve('MYID'));
}

export default {
    getGuestLocation,
    getWaiterOrders,
    orderArrived,
    login,
};
