const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('.../config/dev');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
    
    const sessionObject = {
        passport: {
            user: user._id.toString()
        }
    };

    const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');

    const sig = keygrip.sign('session=' + sessionString);

    return { session, sig };
}