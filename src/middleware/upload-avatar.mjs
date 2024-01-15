import multer from 'multer';
import path from 'path';
import { imageFilter } from '../utils/image.mjs';
import sanitize from 'sanitize-filename';

const storage = multer.diskStorage({
  destination: 'assets/avatars',
  filename: function (req, file, cb) {
    const sanitizedFilename = sanitize(file.originalname);
    cb(null, `${req.session.userId}-sanitized${path.extname(sanitizedFilename)}`);
  },
});

const uploadAvatar = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
}).single('avatar');

export default uploadAvatar;
