class IdentifiedError extends Error {
  constructor(errorCode, message, statusCode = 400) {
    super(message);

    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}

export default IdentifiedError;
