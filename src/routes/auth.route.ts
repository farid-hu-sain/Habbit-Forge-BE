import { Router } from "express";
import * as authController from '../controller/auth.controller'
import { authenticate } from "../middleware/auth.middleware"; // ← TAMBAH INI

const router = Router()

router.post('/login', authController.login)
router.post('/register', authController.register)
router.get('/me', authenticate, authController.meController)

export default router