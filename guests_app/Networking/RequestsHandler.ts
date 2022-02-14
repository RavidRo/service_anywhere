import axios, {AxiosInstance, AxiosResponse} from 'axios';

class RequestsHandler {
	private axiosInstance: AxiosInstance;

	constructor() {
		this.axiosInstance = axios.create({
			baseURL: 'https://service-everywhere.herokuapp.com/',
		});
	}

	private request<T>(
		endPoint: string,
        token: string,
		params: Record<string, unknown>,
		GET = true
	) {
		console.debug(`Request ${endPoint}`, params);

		const request = GET ? this.axiosInstance.get : this.axiosInstance.post;
		return request(`${endPoint}`, GET ? {params} : params, 
        {
            headers:{'Authorization': token}
        })
        .then(response => this.handleResponse<T>(response))
        .catch(e => {
            console.debug(e);
            return Promise.reject(e);
        });
	}

	private handleResponse<T>(response: AxiosResponse<T>) {
		if (response.status === 200) {
			const data = response.data;
			console.debug('The server response', data);
			return Promise.resolve(data);
		} else {
			console.debug(`HTTP Error - ${response.status}`);
			return Promise.reject(`HTTP Error - ${response.status}`);
		}
	}

	post<T>(endPoint: string, token: string, params = {}) {
		return this.request<T>(endPoint, token, params, false);
	}

	get<T>(endPoint: string, token: string, params = {}) {
		return this.request<T>(endPoint, token, params);
	}
}

export default RequestsHandler;
