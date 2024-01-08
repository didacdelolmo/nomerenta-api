import ErrorCode from './error-code';
import IdentifiedError from './identified-error';
import { isCelebrateError } from 'celebrate';

const errorHandler = (error, req, res, next) => {
  console.error('❌ [error-handler]: Something bad happened', error);

  const respond = (statusCode, errorCode) => {
    res.status(statusCode).send({ errorCode, message: error.message });
  };

  if (isCelebrateError(error)) {
    return respond(400, ErrorCode.VALIDATION_ERROR);
  } else if (error instanceof IdentifiedError) {
    return respond(error.statusCode, error.errorCode);
  } else {
    return respond(500, ErrorCode.SOMETHING_BAD_HAPPENED);
  }
};

export { errorHandler };
