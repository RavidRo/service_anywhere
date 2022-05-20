import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import configuration from '../../configuration.json';
import ConnectionModel from '../Models/ConnectionModel';

class RequestsHandler {
	private axiosInstance: AxiosInstance;
	private connection: ConnectionModel;

	constructor() {
		this.connection = ConnectionModel.getInstance();
		this.axiosInstance = axios.create({
			baseURL: configuration['server-url'],
		});
	}

	private request<T>(
		endPoint: string,
		params: Record<string, unknown>,
		GET = true
	) {
		const config: AxiosRequestConfig = {
			headers: {
				...(this.connection.token && {
					Authorization: this.connection.token,
				}),
			},
		};
		console.info(`Request<${endPoint}>`, params);

		const request = GET ? this.axiosInstance.get : this.axiosInstance.post;
		return request(
			`${endPoint}`,
			GET ? {params, ...config} : params,
			config
		)
			.then(response => this.handleResponse<T>(response, endPoint))
			.catch(e => {
				console.warn(e);
				return Promise.reject(e);
			});
	}

	private handleResponse<T>(response: AxiosResponse<T>, endPoint: string) {
		const data = response.data;
		console.info(`Response<${endPoint} , ${response.status}>:`, data);
		return data;
	}

	public post<T>(endPoint: string, params = {}) {
		return this.request<T>(endPoint, params, false);
	}

	public get<T>(endPoint: string, params = {}) {
		return this.request<T>(endPoint, params);
	}
}

export default RequestsHandler;
