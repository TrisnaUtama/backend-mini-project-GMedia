const success = (res, data = {}, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
};

const error = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
        status: 'error',
        message,
        errors,
    });
};

const badRequest = (res, message = 'Bad Request', errors = null) => {
    return error(res, message, 400, errors);
};

const validationError = (res, errors = []) => {
    return error(res, 'Validation Failed', 422, errors);
};

const unauthorized = (res, message = 'Unauthorized') => {
    return error(res, message, 401);
};

const forbidden = (res, message = 'Forbidden') => {
    return error(res, message, 403);
};

const notFound = (res, message = 'Resource Not Found') => {
    return error(res, message, 404);
};

const internalServerError = (res, message = 'Internal Server Error', errors = null) => {
    return error(res, message, 500, errors);
};

module.exports = {
    success,
    error,
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    internalServerError,
    validationError
};
