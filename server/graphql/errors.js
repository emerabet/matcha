exports.errorTypes = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    BAD_REQUEST: 'BAD_REQUEST'
}

exports.errorCodes = {
    UNAUTHORIZED: {
        message: "authentification failed",
        statusCode: 403
    },
    BAD_REQUEST: {
        message: "bad request",
        statusCode: 400
    }
}