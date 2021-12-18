import axios, {AxiosResponse} from 'axios';

function request<T>(endPoint: string, params: object, GET = true) {
    console.debug(`Request ${endPoint}`, params);

    const request = GET ? axios.get : axios.post;
    return request(`/${endPoint}`, GET ? {params} : params).then(response =>
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

// export function getCookie() {
//     return get<string>('get_cookie');
// }

// export function getProductsByStore(cookie: string, storeId: string) {
//     const params = {cookie, store_id: storeId};
//     return get<Product[]>('get_products_by_store', params);
// }

// export function register(cookie: string, username: string, password: string) {
//     const params = {
//         cookie,
//         username,
//         password,
//     };
//     return post<void>('register', params);
// }

// export function login(cookie: string, username: string, password: string) {
//     const params = {
//         cookie,
//         username,
//         password,
//     };
//     return post<void>('login', params);
// }

// export function getStoreDetails(cookie: string, storeId: string) {
//     const params = {cookie, store_id: storeId};
//     return get<Store>('get_stores_details', params);
// }
