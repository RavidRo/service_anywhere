import AuthenticationModel from '../Models/AuthenticationModel';
import Requests from '../networking/Requests';
import Singleton from '../Singleton';

export default class AuthenticateViewModel extends Singleton {
	private requests: Requests;
	private model: AuthenticationModel;

	constructor(requests: Requests) {
		super();
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
