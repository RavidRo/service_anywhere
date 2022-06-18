import {makeAutoObservable} from 'mobx';

export default class ordersModel {
	_alerts: string[] = [];
	_shownAlerts: string[] = [];
	constructor() {
		console.log('Starting the alert model');
		makeAutoObservable(this);
	}

	set alerts(alerts: string[]) {
		console.info('setting alerts to ', alerts);
		this._alerts = alerts;
		this._shownAlerts = alerts;
	}

	get alerts(): string[] {
		return this._alerts;
	}

	set shownAlerts(shownAlerts: string[]) {
		console.info('setting alerts to ', shownAlerts);
		this._shownAlerts = shownAlerts;
	}

	get shownAlerts(): string[] {
		return this._shownAlerts;
	}

	showAlert(alert: string): void {
		this._shownAlerts.push(alert);
	}

	hideAlert(alert: string): void {
		this._shownAlerts = this._shownAlerts.filter(
			_alert => alert !== _alert
		);
	}

	showAllAlerts(): void {
		this._shownAlerts = this._alerts;
	}

	addAlert(alert: string): void {
		const alertWithTime =
			alert + `- Received at ${new Date().toLocaleTimeString()}`;
		this._alerts.push(alertWithTime);
		this.showAlert(alertWithTime);
	}

	removeAlert(alert: string): void {
		this._alerts = this._alerts.filter(entry => entry !== alert);
		this.hideAlert(alert);
	}
}
