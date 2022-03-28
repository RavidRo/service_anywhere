import AuthenticatorChecker from '../../Data/AuthenticatorChecker';
import {makeFail, makeGood, ResponseMsg} from '../../Response';
import * as jwt from 'jsonwebtoken';
const failStatusCode = 401; //todo: change

// https://www.becomebetterprogrammer.com/jwt-authentication-middleware-nodejs-typescript

function generateKey(): string {
	const length = 10;
	var result = '';
	var characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
}

var key = generateKey();
interface TokenPayload {
	permissionLevel: number;
	userId: string;
}

async function login(
	password: string,
	permissionLevel: number
): Promise<ResponseMsg<string>> {
	//returns token
	const userId: string | undefined = await AuthenticatorChecker.getID(
		password
	);
	if (!userId) {
		return makeFail('No matched password was found', failStatusCode);
	}
	const payLoad: TokenPayload = {
		userId,
		permissionLevel,
	};
	return makeGood(
		jwt.sign(payLoad, key, {
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
			return makeFail("Token can't be verified", failStatusCode);
		}
		if (token.toLowerCase().startsWith('bearer')) {
			token = token.slice('bearer'.length).trim();
		}
		// https://github.com/auth0/node-jsonwebtoken/issues/634
		const payLoad: TokenPayload = jwt.verify(token, key) as TokenPayload;
		if (payLoad.permissionLevel < permissionLevel) {
			return makeFail(
				'You dont have access to the requested operation',
				403
			);
		}
		return makeGood(payLoad.userId);
	} catch (err) {
		return makeFail("Token can't be verified", failStatusCode);
	}
}

export default {
	authenticate,
	login,
};
