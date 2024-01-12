import multer from 'multer';
import path from 'path';
import { imageFilter } from '../utils/image.mjs';
import sanitize from 'sanitize-filename';

const storage = multer.diskStorage({
  destination: 'assets',
  filename: function (req, file, cb) {
    const sanitizedFilename = sanitize(file.originalname);
    cb(null, `${req.session.userId}${path.extname(sanitizedFilename)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 1024 },
});

export default upload;
