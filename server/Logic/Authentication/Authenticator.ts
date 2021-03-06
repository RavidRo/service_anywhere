import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as AuthenticatorChecker from '../../Data/AuthenticatorChecker';
import {makeFail, makeGood, ResponseMsg} from '../../Response';

const unauthorizedStatusCode = 401;
const forbiddenStatusCode = 403;

// https://www.becomebetterprogrammer.com/jwt-authentication-middleware-nodejs-typescript
interface TokenPayload {
	permissionLevel: number;
	userId: string;
}

async function login(
	username: string,
	password: string
): Promise<ResponseMsg<string>> {
	const UserCredentials = await AuthenticatorChecker.getDetails(username);
	if (
		UserCredentials === null ||
		!(await bcrypt.compare(password, UserCredentials.password))
	) {
		return makeFail('Wrong username or password', unauthorizedStatusCode);
	}
	const payLoad: TokenPayload = {
		userId: UserCredentials.id,
		permissionLevel: UserCredentials.permissionLevel,
	};
	return makeGood(
		jwt.sign(payLoad, process.env['ACCESS_TOKEN_SECRET']!, {
			algorithm: 'HS256',
			expiresIn: '1h',
		})
	);
}

function authenticate(
	token: string,
	neededPermissionLevel: number
): ResponseMsg<{id: string; permissionLevel: number}> {
	try {
		// remove Bearer if using Bearer Authorization mechanism
		if (!jwt) {
			return makeFail("Token can't be verified", unauthorizedStatusCode);
		}
		if (token.toLowerCase().startsWith('bearer')) {
			token = token.slice('bearer'.length).trim();
		}
		// https://github.com/auth0/node-jsonwebtoken/issues/634
		const payLoad: TokenPayload = jwt.verify(
			token,
			process.env['ACCESS_TOKEN_SECRET']!,
			{
				algorithms: ['HS256'],
			}
		) as TokenPayload;

		if (payLoad.permissionLevel < neededPermissionLevel) {
			return makeFail(
				'You dont have access to the requested operation',
				forbiddenStatusCode
			);
		}
		return makeGood({
			id: payLoad.userId,
			permissionLevel: payLoad.permissionLevel,
		});
	} catch (err) {
		return makeFail("Token can't be verified", unauthorizedStatusCode);
	}
}

export default {
	authenticate,
	login,
};
