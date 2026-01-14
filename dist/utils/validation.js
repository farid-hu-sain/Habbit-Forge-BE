import { validationResult } from "express-validator";
import { errorResponse } from "./response";
export const validate = (validations) => {
    return async (req, res, next) => {
        for (const validation of validations) {
            const result = await validation.run(req);
            if (result.context.errors.length)
                break;
        }
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        const errorList = errors.array().map(err => ({
            field: err.type === 'field' ? err.path : 'unknown',
            message: err.msg
        }));
        return errorResponse(res, "Validasi gagal", 400, errorList);
    };
};
//# sourceMappingURL=validation.js.map