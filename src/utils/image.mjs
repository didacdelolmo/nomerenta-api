import ErrorCode from '../errors/error-code.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import path from 'path';

export const imageFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(
      new IdentifiedError(
        ErrorCode.INVALID_IMAGE_EXTENSION,
        'El formato de esta imágen no es compatible'
      )
    );
  }
};
