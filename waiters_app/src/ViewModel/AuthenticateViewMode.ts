import Requests from '../networking/Requests';

export default class AuthenticateViewModel {
	private requests: Requests;

	constructor(requests: Requests) {
		this.requests = requests;
	}

	login() {
		return this.requests.login();
	}
}
