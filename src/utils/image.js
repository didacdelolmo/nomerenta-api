import ErrorCode from '../errors/error-code';
import IdentifiedError from '../errors/identified-error';
import path from 'path';

export const imageFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(
      new IdentifiedError(ErrorCode.INVALID_IMAGE, 'Invalid image extension'),
      false
    );
  }
};
