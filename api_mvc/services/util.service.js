// reference : https://medium.com/front-end-hacking/error-handling-in-node-javascript-suck-unless-you-know-this-2018-aa0a14cfdd9d

const {to} = require('await-to-js');
const pe = require('parse-error');

module.exports.to = async (promise) => {
    let err, res;
    [err, res] = await to (promise);

    if (err) 
        return [pe(err)];

    return [null, res];
};

// Error Web Response
module.exports.ReE = function(res, err, code) {
    if (typeof err == 'object' && typeof err.message != 'undefined'){
        err = err.message;
    }

    if (typeof code !== 'undefined') 
        res.statusCode = code;

    return res.json({success: false, error: err});
};

// Success Web Response
module.exports.ReS = function(res, data, code) {
    let send_data = {success: true};
    
    if (typeof data == 'object')
    {
        // merge the objects
        send_data = Object.assign(data, send_data);
    }
    if (typeof code !== 'undefined') 
        res.statusCode = code;
    
    return res.json(send_data);
};

// TE stands for Throw Error
module.exports.TE = TE = function(err_message, log){
    if (log === true)
        console.error(err_message);

    throw new Error(err_message);
};
