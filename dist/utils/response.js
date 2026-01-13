export const successResponse = (res, message, data = null, pagination = null, statusCode = 200) => {
    const response = {
        success: true,
        message,
    };
    if (data !== null) {
        response.data = data;
    }
    if (pagination)
        response.pagination = pagination;
    return res.status(statusCode).json(response);
};
export const errorResponse = (res, message, statusCode = 400, errors = null) => {
    const response = {
        success: false,
        message,
    };
    if (errors)
        response.errors = errors;
    return res.status(statusCode).json(response);
};
//# sourceMappingURL=response.js.map