'use strict';

function reportError(statusCode, errorCode, errorMessage, res) {
    const statusMsg = {
        200: 'OK',
        201: 'Created',
        204: 'No Content',
        400: 'Bad Request',
        404: 'Not Found'
    };

    res
        .status(statusCode)
        .json({
            status: statusCode,
            statusTxt: statusMsg[statusCode],
            errorCode,
            errorMessage,
            requestTime: Date.now()
        })
        .end();
}

function getErrorInfo(type, source, msg) {
    const errorType = {
        'notvalid': {errorCode: 1001, statusCode: 500, errorMessage: msg ? msg: `${source} is not valid` },
        'required': {errorCode: 1002, statusCode: 400, errorMessage: msg ? msg: `${source} required` },
        'typeError': {errorCode: 1003, statusCode: 400, errorMessage: msg ? msg: `${source} type error` },
        'empty': {errorCode: 1004, statusCode: 400, errorMessage: msg ? msg: 'empty body' },
        'format': {errorCode: 1005, statusCode: 400, errorMessage: msg ? msg: 'data format error' },
        'notValidAttr': {errorCode: 1006, statusCode: 400, errorMessage: msg ? msg: `attribute ${source} is not valid` },
        'noId': {errorCode: 1007, statusCode: 400, errorMessage: msg ? msg: 'Id should not be provided' },
        'duplicated': {errorCode: 1008, statusCode: 400, errorMessage: msg ? msg: `${source} duplicated` },
        'notUnique': {errorCode: 1009, statusCode: 400, errorMessage: msg ? msg: `${source} is not unique` },
        'ObjectId': {errorCode: 1010, statusCode: 400, errorMessage: msg ? msg: `resouce ${source} not found`}
    };

    return errorType[type] ? errorType[type] : {
        errorCode: 9999,
        errorMessage: msg ? msg: `unknow error`,
        statusCode: 500
    };
};

function handleMongooError(err, res, source) {
    let errorInfo; 
    const detailErrors = err.errors;

    if (err && err.kind) {
        errorInfo = getErrorInfo(err.kind, err.path, err.message);
    } else if (detailErrors) {
        for(let errName in detailErrors) {
            if(detailErrors.hasOwnProperty(errName)) {
                errorInfo = getErrorInfo(detailErrors[errName].kind, errName, detailErrors[errName].message);
            }
        }
    } else {
        // custom error
        errorInfo = {
            statusCode: 400,
            errorCode: 1001,
            errorMessage: err.message
        }
    }
    reportError(errorInfo.statusCode, errorInfo.errorCode, errorInfo.errorMessage, res);
};
    
function throwIfMissing(param) {
    throw new Error(`${param} required`);
};
        
function validateEmail(email) {
    var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEx.test(email);
}

function validatePhoneNo(phone) {
    var regEx = /[\d]{3}-[\d]{3}-[\d]{4}/;
    return regEx.test(phone);
}

module.exports = {
    reportError,
    handleMongooError,
    throwIfMissing,
    validateEmail
}