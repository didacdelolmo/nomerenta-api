import { MulterError } from 'multer';
import ErrorCode from './error-code.mjs';
import IdentifiedError from './identified-error.mjs';
import { isCelebrateError } from 'celebrate';

const errorHandler = (error, req, res, next) => {
  console.error('❌ [error-handler]: Something bad happened', error);

  const respond = (statusCode, errorCode) => {
    res.status(statusCode).send({ errorCode, message: error.message });
  };

  if (isCelebrateError(error)) {
    return respond(400, ErrorCode.VALIDATION_ERROR);
  } else if (error instanceof MulterError) {
    return respond(400, ErrorCode.INVALID_AVATAR);
  } else if (error instanceof IdentifiedError) {
    return respond(error.statusCode, error.errorCode);
  } else {
    return respond(500, ErrorCode.SOMETHING_BAD_HAPPENED);
  }
};

export { errorHandler };
