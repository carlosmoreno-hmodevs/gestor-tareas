import multer from 'multer';

const MAX_BYTES = 10 * 1024 * 1024;

export const evidenceUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    const allowed =
      file.mimetype.startsWith('image/') ||
      file.mimetype === 'application/pdf' ||
      file.mimetype.includes('word') ||
      file.mimetype.includes('sheet') ||
      file.mimetype.includes('excel') ||
      file.mimetype === 'application/msword';
    if (allowed) cb(null, true);
    else cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
  },
}).single('file');
