import AlertModel from '../src/model/alertModel';
import AlertViewModel from '../src/viewModel/alertViewModel';

let alertModel: AlertModel;
let alertViewModel: AlertViewModel;
const alerts = ['alert 1', 'alert 2', 'alert 3'];

beforeEach(() => {
	alertModel = new AlertModel();
	alertViewModel = new AlertViewModel(alertModel);

	jest.spyOn(console, 'info').mockImplementation(jest.fn());
	jest.spyOn(console, 'log').mockImplementation(jest.fn());
	jest.spyOn(console, 'warn').mockImplementation(jest.fn());
});

describe('Constructor', () => {
	test('The class can be created successfully', async () => {
		expect(alertViewModel).toBeTruthy();
	});

	test('set and get alerts', async () => {
		alertViewModel.setAlerts(alerts);
		expect(alertViewModel.getAlerts()).toEqual(alerts);
	});

	test('shown alerts equals set alerts without hiding', async () => {
		alertViewModel.setAlerts(alerts);
		expect(alertViewModel.getShownAlerts()).toEqual(alerts);
	});

	test('shown alerts equal alerts after removal of alert', async () => {
		alertViewModel.setAlerts(alerts);
		alertViewModel.removeAlert(alerts[0]);
		expect(alertViewModel.getAlerts()).toEqual(
			alertViewModel.getShownAlerts()
		);
	});

	test('hide alert doesnt remove it ', async () => {
		alertViewModel.setAlerts(alerts);
		alertViewModel.hideAlert(alerts[0]);
		expect(alertViewModel.getShownAlerts()).toEqual(
			alerts.filter(alert => alert !== alerts[0])
		);
	});
});
