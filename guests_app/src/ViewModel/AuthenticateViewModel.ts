import Requests from '../Networking/requests';

export default class AuthenticateViewModel {
	private requests: Requests;

	constructor(requests: Requests) {
		this.requests = requests;
	}

	login(phone_number: String, password: String) {
		return this.requests.login(phone_number, password).then((token: string) => this.requests.setToken(token));
	}
}
