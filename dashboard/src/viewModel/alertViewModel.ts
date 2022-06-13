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

	setShownAlerts(shownAlerts: string[]) {
		console.info('setting alerts to ', shownAlerts);
		this.alertModel.shownAlerts = shownAlerts;
	}

	getShownAlerts(): string[] {
		return this.alertModel.shownAlerts;
	}

	showAlert(alert: string): void {
		this.alertModel.showAlert(alert);
	}

	hideAlert(alert: string): void {
		this.alertModel.hideAlert(alert);
	}

	showAllAlerts(): void {
		this.alertModel.showAllAlerts();
	}
}
