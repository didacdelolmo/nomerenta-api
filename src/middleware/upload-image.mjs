import multer from 'multer';
import { imageFilter } from '../utils/image.mjs';

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  // (!) The limit is 2 MB, not 2.1 MB
  limits: { fileSize: 2.1 * 1024 * 1024 },
}).single('image');
