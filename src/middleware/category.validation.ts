import { body, param } from "express-validator";

export const createCategoryValidation = [
  body("name")
    .notEmpty()
    .withMessage("Nama kategori diperlukan")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Nama kategori harus 2-50 karakter"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Deskripsi maksimal 200 karakter"),

  body("color")
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage("Format warna harus #RRGGBB"),

  body("icon")
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage("Icon maksimal 10 karakter"),
];

export const updateCategoryValidation = [
  param("id").isUUID().withMessage("Category ID harus format UUID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Nama kategori harus 2-50 karakter"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Deskripsi maksimal 200 karakter"),

  body("color")
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage("Format warna harus #RRGGBB"),

  body("icon")
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage("Icon maksimal 10 karakter"),
];
