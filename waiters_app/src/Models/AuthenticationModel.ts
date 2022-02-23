import {makeAutoObservable} from 'mobx';

export default class AuthenticationModel {
	private _token: string | undefined;

	constructor() {
		makeAutoObservable(this);
	}

	get token(): string | undefined {
		return this._token;
	}

	set token(newID: string | undefined) {
		this._token = newID;
	}
}
