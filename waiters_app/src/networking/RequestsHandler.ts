import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import ConnectionModel from '../Models/ConnectionModel';

class RequestsHandler {
	private axiosInstance: AxiosInstance;
	private connection: ConnectionModel;

	constructor() {
		this.connection = ConnectionModel.getInstance();
		this.axiosInstance = axios.create({
			baseURL: 'https://service-everywhere.herokuapp.com/',
		});
	}

	private request<T>(
		endPoint: string,
		params: Record<string, unknown>,
		GET = true
	) {
		console.debug(`Request ${endPoint}`, params);
		const config: AxiosRequestConfig = {
			headers: {
				...(this.connection.token && {
					Authorization: this.connection.token,
				}),
			},
		};

		const request = GET ? this.axiosInstance.get : this.axiosInstance.post;
		return request(`${endPoint}`, GET ? {params} : params, config)
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

	public post<T>(endPoint: string, params = {}) {
		return this.request<T>(endPoint, params, false);
	}

	public get<T>(endPoint: string, params = {}) {
		return this.request<T>(endPoint, params);
	}
}

export default RequestsHandler;
