import type { Request, Response, NextFunction } from "express"
import { validationResult, type ValidationChain } from "express-validator"
import { errorResponse } from "./response.js"

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const validation of validations) {
      const result = await validation.run(req)
      if (result.context.errors.length) break
    }

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    const errorList = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg
    }))

    return errorResponse(res, "Validasi gagal", 400, errorList)
  }
}