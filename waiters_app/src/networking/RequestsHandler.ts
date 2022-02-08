import axios, {AxiosInstance, AxiosResponse} from 'axios';
import configuration from '../../configuration.json';

class RequestsHandler {
	private axiosInstance: AxiosInstance;

	constructor() {
		this.axiosInstance = axios.create({
			baseURL: configuration['server-url'],
		});
	}

	private request<T>(
		endPoint: string,
		params: Record<string, unknown>,
		GET = true
	) {
		console.info(`Request ${endPoint}:`, params);

		const request = GET ? this.axiosInstance.get : this.axiosInstance.post;
		return request(`${endPoint}`, GET ? {params} : params)
			.then(response => this.handleResponse<T>(response))
			.catch(e => {
				console.warn(e);
				return Promise.reject(e);
			});
	}

	private handleResponse<T>(response: AxiosResponse<T>) {
		if (response.status === 200) {
			const data = response.data;
			console.info('The server response:', data);
			return Promise.resolve(data);
		} else {
			console.warn(`HTTP Error - ${response.status}`);
			return Promise.reject(`HTTP Error - ${response.status}`);
		}
	}

	post<T>(endPoint: string, params = {}) {
		return this.request<T>(endPoint, params, false);
	}

	get<T>(endPoint: string, params = {}) {
		return this.request<T>(endPoint, params);
	}
}

export default RequestsHandler;
