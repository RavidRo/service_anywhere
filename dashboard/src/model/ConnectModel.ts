import {makeAutoObservable} from 'mobx';

class ConnectModel {
	private _token: string | undefined;
	private _isReconnecting: boolean;

	private constructor() {
		this._isReconnecting = false;
		makeAutoObservable(this);
	}

	get isReconnecting(): boolean {
		return this._isReconnecting;
	}
	set isReconnecting(reconnecting: boolean) {
		this._isReconnecting = reconnecting;
	}

	get token(): string | undefined {
		return this._token;
	}
	set token(t: string | undefined) {
		this._token = t;
	}

	static instance?: ConnectModel;
	static getInstance(): ConnectModel {
		if (!this.instance) {
			this.instance = new ConnectModel();
		}
		return this.instance;
	}
}

export default ConnectModel;
