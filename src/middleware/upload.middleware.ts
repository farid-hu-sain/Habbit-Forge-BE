import multer from "multer";
import path from "path";
import crypto from "crypto";
import type { Request } from "express";

// Allowed image MIME types
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

// Max file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (_req, file, cb) => {
    // Generate secure random filename
    const randomName = crypto.randomBytes(16).toString("hex");
    const extension = path.extname(file.originalname).toLowerCase();
    const safeFileName = randomName + extension;

    cb(null, safeFileName);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Check MIME type
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Hanya file gambar (JPEG, PNG, GIF, WebP) yang diperbolehkan",
      ) as any,
    );
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1, // Max 1 file per request
  },
  fileFilter: fileFilter,
});
