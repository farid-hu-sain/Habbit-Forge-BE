import { body } from "express-validator";

export const updateProfileValidation = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Nama lengkap maksimal 100 karakter"),
    
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio maksimal 500 karakter"),
];