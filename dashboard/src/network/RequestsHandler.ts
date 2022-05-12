import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import configuration from './config.json';
import ConnectionModel from '../model/ConnectModel';
import {isString} from '../typeGuard';

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
			.catch(error => {
				if (error.response) {
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					const rawMsg = error?.response?.data;
					console.warn(`Request<${endPoint}>`, rawMsg ?? error);
					const msg = isString(rawMsg)
						? rawMsg
						: 'An unknown error has been received from the server';
					return Promise.reject(msg);
				} else if (error.request) {
					// The request was made but no response was received
					// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
					// http.ClientRequest in node.js
					console.warn(`Request<${endPoint}>`, error.request);
					return Promise.reject(
						'Could not receive a response from the server'
					);
				} else {
					// Something happened in setting up the request that triggered an Error
					console.warn(`Request<${endPoint}>`, error.message);
					return Promise.reject(
						'There was a problem in sending the request'
					);
				}
			});
	}

	private handleResponse<T>(response: AxiosResponse<T>) {
		if (response.status === 200) {
			const data = response.data;
			console.info('The server response:', data);
			return Promise.resolve(data);
		} else {
			alert(response.data);
			console.warn(`HTTP Error - ${response.status} - ${response.data}`);
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
