import {Response, Request, NextFunction} from 'express';
import Authenticator from '../Logic/Authentication/Authenticator';

export function authenticate(permissionLevel: number) {
	return function (req: Request, res: Response, next: NextFunction) {
		const token = req.headers.authorization;
		if (token) {
			const response = Authenticator.authenticate(token, permissionLevel);
			if (response.isSuccess()) {
				req.userID = response.getData();
				next();
			} else {
				res.status(response.getStatusCode());
				res.send(response.getError());
			}
		} else {
			res.status(401); // Unauthorized
			res.send("Authorization token is missing in request's headers");
		}
	};
}
