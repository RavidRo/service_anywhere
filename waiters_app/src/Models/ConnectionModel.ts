import {makeAutoObservable} from 'mobx';

export default class ConnectionModel {
	private _token: string | undefined;
	private _reconnectingToServer: boolean;

	private constructor() {
		this._reconnectingToServer = false;
		makeAutoObservable(this);
	}

	static instance?: ConnectionModel;
	static getInstance(): ConnectionModel {
		if (!this.instance) {
			this.instance = new ConnectionModel();
		}
		return this.instance;
	}

	get token(): string | undefined {
		return this._token;
	}

	set token(newID: string | undefined) {
		this._token = newID;
	}

	get reconnectingToServer() {
		return this._reconnectingToServer;
	}
	set reconnectingToServer(reconnecting: boolean) {
		this._reconnectingToServer = reconnecting;
	}
}
