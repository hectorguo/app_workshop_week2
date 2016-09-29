'use strict';

function reportError(statusCode, errorCode, errorMsg, res) {
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
            errorMsg,
            timestamp: Date.now()
        })
        .end();
}

function getErrorInfo(type, source) {
    const errorType = {
        1001: {
            type: 'notvalid',
            msg: `${source} is not valid`,
            status: 500
        },
        1002: {
            type: 'required',
            msg: `${source} required`,
            status: 400
        },
        1003: {
            type: 'typeerror',
            msg: `${source} type error`,
            status: 400
        },
        1004: {
            type: 'empty',
            msg: 'empty body',
            status: 400
        },
        1005: {
            type: 'format',
            msg: 'data format error',
            status: 400
        },
        1006: {
            type: 'notvalidattr',
            msg: `attribute ${source} is not valid`,
            status: 400
        },
        1007: {
            type: 'notid',
            msg: 'Id should not be provided',
            status: 400
        },
        1008: {
            type: 'duplicated',
            msg: `${source} duplicated`,
            status: 400
        },
        1009: {
            type: 'notunique',
            msg: `${source} is not unique`,
            status: 400
        }
    }

    let errorInfo;

    for(let key in errorType) {
        if(errorType[key].type === type) {
            errorInfo = {
                errorCode: key,
                errorMsg: errorType[key].msg,
                statusCode: errorType[key].status
            }
        }
    }
    return errorInfo;
    // let statusCode = 200;
    // let errCode;
    // let errMsg = '';

    // switch (type) {
    //     case errorType.REQUIRED:
    //         statusCode = 400;
    //         errCode = 1002;
    //         errMsg = `${source} required`;
    //         break;
    //     case errorType.NOTVALID:
    //         statusCode = 400;
    //         errCode = 1001;
    //         errMsg = `${source} is not valid`;
    //         break;
    //     case errorType.TYPEERR:
    //         statusCode = 400;
    //         errCode = 1003;
    //         errMsg = `${source} type error`;
    //         break;
    // }
    // return {
    //     statusCode,
    //     errCode,
    //     errMsg
    // }
};

function handleMongooError(err, res, source) {
    let errorInfo; 

    if (err && err.kind) {
        errorInfo = getErrorInfo(err.kind, err.path);
    } else if (err.errors) {
        for(let errName in err.errors) {
            errorInfo = getErrorInfo(err.errors[errName].kind, errName); 
        }
    } else {
        // custom error
        errorInfo = {
            statusCode: 400,
            errCode: 1001,
            errMsg: err.message
        }
    }
    reportError(errorInfo.statusCode, errorInfo.errCode, errorInfo.errMsg, res);
};
    
function throwIfMissing(param) {
    throw new Error(`${param} required`);
};
        
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports = {
    reportError,
    handleMongooError,
    throwIfMissing,
    validateEmail
}