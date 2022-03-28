import AuthenticatorChecker from '../../Data/AuthenticatorChecker';
import {makeFail, makeGood, ResponseMsg} from '../../Response';

let jwt = require('jsonwebtoken');
const failStatusCode = 400; //todo: change

function generateKey(): string {
	const length = 10;
	let result = '';
	let characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
}

let key = generateKey();

function loginPhone(phoneNumber: string): string {
	//returns token
	return jwt.sign(AuthenticatorChecker.checkPhone(phoneNumber), key, {
		expiresIn: '1h',
	});
}

function loginPass(password: string): string {
	//returns token
	return jwt.sign(AuthenticatorChecker.checkPass(password), key, {
		expiresIn: '1h',
	});
}

function authenticate(token: string): ResponseMsg<string> {
	//returns Id
	try {
		let id = jwt.verify(token, key);
		if (AuthenticatorChecker.validateId(id)) {
			return makeGood(id);
		} else {
			return makeFail(
				'The token entered does not match any ID.',
				failStatusCode
			);
		}
	} catch (err) {
		return makeFail("Token can't be verified", failStatusCode);
	}
}

function authenticateAdmin(token: string): ResponseMsg<string> {
	//returns Id
	try {
		let id = jwt.verify(token, key);
		if (AuthenticatorChecker.validateAdmin(id)) {
			return makeGood(id);
		} else {
			return makeFail(
				'The token entered does not match any admin ID.',
				failStatusCode
			);
		}
	} catch (err) {
		return makeFail("Token can't be verified", failStatusCode);
	}
}

export default {
	loginPhone,
	loginPass,
	authenticate,
	authenticateAdmin,
};
