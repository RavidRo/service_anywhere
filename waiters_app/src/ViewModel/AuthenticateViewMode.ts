import Requests from '../networking/requests';

export default class AuthenticateViewModel {
	private requests: Requests;

	constructor() {
		this.requests = new Requests();
	}

	login() {
		return this.requests.login();
	}
}
