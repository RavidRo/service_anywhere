import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import configuration from './config.json';
import ConnectionModel from '../model/ConnectModel';

class RequestsHandler {
	private axiosInstance: AxiosInstance;
	private connection: ConnectionModel;

	constructor() {
		this.connection = ConnectionModel.getInstance();
		this.axiosInstance = axios.create({
			baseURL: configuration['host'],
		});
	}

	private request<T>(
		endPoint: string,
		params: Record<string, unknown>,
		GET = true
	) {
		console.info(`Request ${endPoint}`, params);
		const config: AxiosRequestConfig = {
			headers: {
				...(this.connection.token && {
					Authorization: this.connection.token,
				}),
			},
		};

		const request = GET ? this.axiosInstance.get : this.axiosInstance.post;
		return request(
			`${endPoint}`,
			GET ? {params, ...config} : params,
			config
		)
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

	public post<T>(endPoint: string, params = {}) {
		return this.request<T>(endPoint, params, false);
	}

	public get<T>(endPoint: string, params = {}) {
		return this.request<T>(endPoint, params);
	}
}

export default RequestsHandler;
