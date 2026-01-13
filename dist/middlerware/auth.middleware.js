import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";
import config from "../utils/env.js";
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        errorResponse(res, "token tidak ditemukan", 401);
    const token = authHeader?.split(" ")[1];
    try {
        const payload = jwt.verify(token, config.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (error) {
        errorResponse(res, "token tidak valid", 401);
    }
};
//# sourceMappingURL=auth.middleware.js.map
