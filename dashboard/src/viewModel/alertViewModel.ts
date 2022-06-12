import AlertModel from '../model/alertModel';

export default class AlertViewModel {
	private alertModel: AlertModel;

	constructor(alertModel: AlertModel) {
		console.log('Starting alerts view model');
		this.alertModel = alertModel;
	}

	getAlerts(): string[] {
		return this.alertModel.alerts;
	}

	setAlerts(alerts: string[]) {
		this.alertModel.alerts = alerts;
	}

	addAlert(alert: string): void {
		this.alertModel.addAlert(alert);
	}

	removeAlert(alert: string): void {
		this.alertModel.removeAlert(alert);
	}
}
