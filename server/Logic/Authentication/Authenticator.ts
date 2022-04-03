import * as AuthenticatorChecker from '../../Data/AuthenticatorChecker';
import {makeFail, makeGood, ResponseMsg} from '../../Response';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
const unauthorizedStatusCode = 401;
const forbiddenStatusCode = 403;

const privateKey = fs.readFileSync(path.join(__dirname, './../../public.key'));
const publicKey = fs.readFileSync(path.join(__dirname, './../../public.key'));

// https://www.becomebetterprogrammer.com/jwt-authentication-middleware-nodejs-typescript
interface TokenPayload {
	permissionLevel: number;
	userId: string;
}

async function login(
	password: string,
	neededPermissionLevel: number
): Promise<ResponseMsg<string>> {
	const UserCredentials = await AuthenticatorChecker.getDetails(password);
	if (
		!UserCredentials ||
		neededPermissionLevel > UserCredentials.permissionLevel
	) {
		return makeFail(
			'No matched password was found',
			unauthorizedStatusCode
		);
	}
	const payLoad: TokenPayload = {
		userId: UserCredentials.id,
		permissionLevel: UserCredentials.permissionLevel,
	};
	return makeGood(
		jwt.sign(payLoad, privateKey, {
			algorithm: 'RS256',
			expiresIn: '1h',
		})
	);
}

function authenticate(
	token: string,
	permissionLevel: number
): ResponseMsg<string> {
	try {
		// remove Bearer if using Bearer Authorization mechanism
		if (!jwt) {
			return makeFail("Token can't be verified", unauthorizedStatusCode);
		}
		if (token.toLowerCase().startsWith('bearer')) {
			token = token.slice('bearer'.length).trim();
		}
		// https://github.com/auth0/node-jsonwebtoken/issues/634
		const payLoad: TokenPayload = jwt.verify(token, publicKey, {
			algorithms: ['RS256'],
		}) as TokenPayload;
		if (payLoad.permissionLevel < permissionLevel) {
			return makeFail(
				'You dont have access to the requested operation',
				forbiddenStatusCode
			);
		}
		return makeGood(payLoad.userId);
	} catch (err) {
		return makeFail("Token can't be verified", unauthorizedStatusCode);
	}
}

export default {
	authenticate,
	login,
};
