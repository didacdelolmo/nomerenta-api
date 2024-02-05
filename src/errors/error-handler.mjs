import { MulterError } from 'multer';
import ErrorCode from './error-code.mjs';
import IdentifiedError from './identified-error.mjs';
import { isCelebrateError } from 'celebrate';
import mongoose from 'mongoose'

const errorHandler = (err, req, res, next) => {
  console.error('❌ [error-handler]: Something bad happened', err);

  const respond = (statusCode, errorCode, message = err.message) => {
    return res.status(statusCode).send({ errorCode, message });
  };

  if (isCelebrateError(err)) {
    respond(400, ErrorCode.VALIDATION_ERROR);
  } else if (err instanceof MulterError) {
    respond(400, ErrorCode.INVALID_AVATAR);
  } else if (err instanceof mongoose.Error.CastError) {
    respond(400, ErrorCode.INVALID_IDENTIFIER, 'Invalid identifier');
  } else if (err instanceof IdentifiedError) {
    respond(err.statusCode, err.errorCode);
  } else {
    respond(500, ErrorCode.SOMETHING_BAD_HAPPENED);
  }
};

export { errorHandler };
