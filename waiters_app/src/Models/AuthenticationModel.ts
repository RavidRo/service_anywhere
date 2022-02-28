import {makeAutoObservable} from 'mobx';

export default class AuthenticationModel {
	private _token: string | undefined;

	private constructor() {
		makeAutoObservable(this);
	}

	static instance?: AuthenticationModel;
	static getInstance(): AuthenticationModel {
		if (!this.instance) {
			this.instance = new AuthenticationModel();
		}
		return this.instance;
	}

	get token(): string | undefined {
		return this._token;
	}

	set token(newID: string | undefined) {
		this._token = newID;
	}
}
