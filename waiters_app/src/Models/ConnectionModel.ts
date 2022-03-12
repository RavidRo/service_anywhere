import {makeAutoObservable} from 'mobx';

export default class ConnectionModel {
	public token: string | undefined;
	public isReconnecting: boolean;

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
}
