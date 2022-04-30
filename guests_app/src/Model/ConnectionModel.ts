import {makeAutoObservable} from 'mobx';

export default class ConnectionModel {
	private _token: string;
	private _isReconnecting: boolean;

	private constructor() {
		this.isReconnecting = false;
		makeAutoObservable(this);
	}

	static instance?: ConnectionModel;
	static getInstance(): ConnectionModel {
		if (!this.instance) {
			this.instance = new ConnectionModel();
		}
		return this.instance;
	}

	set token(newToken: string) {
		this._token = newToken;
	}

	get token(): string {
		return this._token;
	}

	set isReconnecting(value: boolean) {
		this._isReconnecting = value;
	}

	get isReconnecting() {
		return this._isReconnecting;
	}
}