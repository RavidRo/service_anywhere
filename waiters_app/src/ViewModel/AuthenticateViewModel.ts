import AuthenticationModel from '../Models/AuthenticationModel';
import Requests from '../networking/Requests';

export default class AuthenticateViewModel {
	private requests: Requests;
	private model: AuthenticationModel;

	constructor(requests: Requests) {
		this.model = AuthenticationModel.getInstance();
		this.requests = requests;
	}

	login(): Promise<string> {
		return this.requests.login().then(token => {
			this.model.token = token;
			return token;
		});
	}

	get token(): string | undefined {
		return this.model.token;
	}
}
