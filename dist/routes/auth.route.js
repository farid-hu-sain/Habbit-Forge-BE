import { Router } from "express";
import * as authController from "../controller/auth.controller.js";
const router = Router();
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/me", authController.meController);
// untuk log itu urusan FE dengan menambahkan 
// const logout = () => {
//   localStorage.removeItem('token');
//   window.location.href = '/login';
// };
export default router;
//# sourceMappingURL=auth.route.js.map
