import {makeAutoObservable} from 'mobx';

export default class ordersModel {
	_alerts: string[] = [];

	constructor() {
		console.log('Starting the alert model');
		makeAutoObservable(this);
	}

	set alerts(alerts: string[]) {
		console.info('setting alerts to ', alerts);
		this._alerts = alerts;
	}

	get alerts(): string[] {
		return this._alerts;
	}

	addAlert(alert: string): void {
		this._alerts.push(alert);
	}

	removeAlert(alert: string): void {
		this._alerts = this._alerts.filter(entry => entry !== alert);
	}
}
