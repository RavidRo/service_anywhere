import AuthenticatorChecker from '../../Data/AuthenticatorChecker'
var jwt = require('jsonwebtoken');

function generateKey(): string {
    const length = 10;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;    
}

var key = generateKey()

function loginPhone(phoneNumber: string): string{   //returns token
    return jwt.sign(AuthenticatorChecker.checkPhone(phoneNumber), key, { expiresIn: '1h'});
}

function loginPass(password: string): string{   //returns token
    return jwt.sign(AuthenticatorChecker.checkPass(password), key, { expiresIn: '1h'});
}

function authenticate(token: string): string{   //returns Id
    try{
        var id = jwt.verify(token, key);
    }
    catch(err){
        return '' //todo: responses
    }
    if (AuthenticatorChecker.validateId(id)) {
        return id;
    }
    else{
        return '' //todo: response
    }
}

function authenticateAdmin(token: string): string{  //returns Id
    try{
        var id = jwt.verify(token, key);
    }
    catch(err){
        return '' //todo: responses
    }
    if (AuthenticatorChecker.validateAdmin(id)) {
        return id;
    }
    else{
        return '' //todo: response
    }
}