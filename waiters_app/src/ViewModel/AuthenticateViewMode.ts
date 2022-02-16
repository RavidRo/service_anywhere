import Requests from '../networking/Requests';

export default class AuthenticateViewModel {
	private requests: Requests;

	constructor() {
		this.requests = new Requests();
	}

	login() {
		return this.requests.login();
	}
}
