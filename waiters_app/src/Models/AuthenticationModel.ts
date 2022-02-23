import {makeAutoObservable} from 'mobx';

export default class AuthenticationModel {
	private _id: string | undefined;

	constructor() {
		makeAutoObservable(this);
	}

	get id(): string | undefined {
		return this._id;
	}

	set id(newID: string | undefined) {
		this._id = newID;
	}
}
