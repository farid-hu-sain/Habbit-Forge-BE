import { body, param } from "express-validator";

export const createHabitValidation = [
  body("title")
    .notEmpty()
    .withMessage("Judul habit diperlukan")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Judul harus 3-100 karakter"),
  
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Deskripsi maksimal 500 karakter"),
  
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive harus boolean"),
    
  body("categoryId")
    .optional()
    .isUUID()
    .withMessage("Category ID harus format UUID valid"),
];

export const updateHabitValidation = [
  param("id")
    .isUUID()
    .withMessage("Habit ID harus format UUID"),
    
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Judul harus 3-100 karakter"),
  
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Deskripsi maksimal 500 karakter"),
  
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive harus boolean"),
    
  body("categoryId")
    .optional()
    .isUUID()
    .withMessage("Category ID harus format UUID valid"),
];