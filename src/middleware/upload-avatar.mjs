import multer from 'multer';
import { imageFilter } from '../utils/image.mjs';

export const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  // (!) The limit is 1 MB, not 1.1 MB
  limits: { fileSize: 1.1 * 1024 * 1024 },
}).single('avatar');
