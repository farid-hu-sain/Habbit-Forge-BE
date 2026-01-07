import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import { errorResponse } from '../utils/response'
import config from "../utils/env"

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    // ✅ TAMBAH RETURN!
    if (!authHeader) {
        return errorResponse(res, "token tidak ditemukan", 401)
    }

    const token = authHeader.split(" ")[1] // ✅ Hapus optional chaining

    // ✅ VALIDASI TOKEN TIDAK KOSONG
    if (!token) {
        return errorResponse(res, "token tidak ditemukan", 401)
    }

    try {
        const payload = jwt.verify(token, config.JWT_SECRET) as { id: string }
        
        // ✅ SET USER KE REQUEST
        req.user = payload
        
        // ✅ LANJUT KE NEXT MIDDLEWARE/CONTROLLER
        next()
    } catch (error) {
        // ✅ TAMBAH RETURN!
        return errorResponse(res, "token tidak valid", 401)
    }
}