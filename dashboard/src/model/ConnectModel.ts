import {makeAutoObservable} from 'mobx';

export default class ConnectModel {
	public token: string | undefined;
	public isReconnecting: boolean;

	private constructor() {
		this.isReconnecting = false;
		makeAutoObservable(this);
	}

	static instance?: ConnectModel;
	static getInstance(): ConnectModel {
		if (!this.instance) {
			this.instance = new ConnectModel();
		}
		return this.instance;
	}
}
