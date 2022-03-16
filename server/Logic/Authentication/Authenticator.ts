import AuthenticatorChecker from '../../Data/AuthenticatorChecker';
import {makeFail, makeGood, ResponseMsg} from '../../Response';

var jwt = require('jsonwebtoken');
const failStatusCode = 400; //todo: change

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
		var id = jwt.verify(token, key);
	} catch (err) {
		return makeFail("Token can't be verified", failStatusCode);
	}
	if (AuthenticatorChecker.validateId(id)) {
		return makeGood(id);
	} else {
		return makeFail(
			'The token entered does not match any ID.',
			failStatusCode
		);
	}
}

function authenticateAdmin(token: string): ResponseMsg<string> {
	//returns Id
	try {
		var id = jwt.verify(token, key);
	} catch (err) {
		return makeFail("Token can't be verified", failStatusCode);
	}
	if (AuthenticatorChecker.validateAdmin(id)) {
		return makeGood(id);
	} else {
		return makeFail(
			'The token entered does not match any admin ID.',
			failStatusCode
		);
	}
}

export default {
	loginPhone,
	loginPass,
	authenticate,
	authenticateAdmin,
};
