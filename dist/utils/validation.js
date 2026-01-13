import { validationResult } from "express-validator";
import { errorResponse } from "./response.js";
export const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        const errorList = errors.array().map(err => ({
            field: err.type === "field" ? err.path : "unknown",
            message: err.msg
        }));
        return errorResponse(res, "Validasi gagal", 400, errorList);
    };
};
//# sourceMappingURL=validation.js.map
