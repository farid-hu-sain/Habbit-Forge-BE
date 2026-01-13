import { body } from "express-validator";

export const registerValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email diperlukan")
    .isEmail()
    .withMessage("Format email tidak valid")
    .normalizeEmail(),
    
  body("username")
    .notEmpty()
    .withMessage("Username diperlukan")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username harus 3-30 karakter")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username hanya boleh huruf, angka, dan underscore"),
    
  body("password")
    .notEmpty()
    .withMessage("Password diperlukan")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
];

export const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email diperlukan")
    .isEmail()
    .withMessage("Format email tidak valid")
    .normalizeEmail(),
    
  body("password")
    .notEmpty()
    .withMessage("Password diperlukan"),
];