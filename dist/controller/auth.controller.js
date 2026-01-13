import * as authService from "../service/auth.service.js";
import { successResponse } from "../utils/response.js";
export const login = async (req, res) => {
    const result = await authService.login(req.body);
    successResponse(res, "login sukses", result, null, 200);
};
export const register = async (req, res) => {
    const result = await authService.register(req.body);
    successResponse(res, "registrasi berhasil", result, null, 201);
};
export const meController = async (req, res) => {
    const result = await authService.getCurrentUser(req.body);
    successResponse(res, "user berhasil ditampilkan", result, null, 201);
};
//# sourceMappingURL=auth.controller.js.map
