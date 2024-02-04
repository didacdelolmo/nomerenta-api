import { MulterError } from 'multer';
import ErrorCode from './error-code.mjs';
import IdentifiedError from './identified-error.mjs';
import { isCelebrateError } from 'celebrate';

const errorHandler = (err, req, res, next) => {
  console.error('❌ [error-handler]: Something bad happened', err);

  const respond = (statusCode, errorCode) => {
    res.status(statusCode).send({ errorCode, message: err.message });
  };

  if (isCelebrateError(err)) {
    return respond(400, ErrorCode.VALIDATION_ERROR);
  } else if (err instanceof MulterError) {
    return respond(400, ErrorCode.INVALID_AVATAR);
  } else if (err instanceof IdentifiedError) {
    return respond(err.statusCode, err.errorCode);
  } else {
    return respond(500, ErrorCode.SOMETHING_BAD_HAPPENED);
  }
};

export { errorHandler };
