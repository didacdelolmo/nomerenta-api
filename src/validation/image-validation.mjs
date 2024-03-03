export const validateImageInput = (req, res, next) => {
  if (!req.file) {
    throw new IdentifiedError(
      ErrorCode.IMAGE_REQUIRED,
      'Es necesario subir una imágen'
    );
  }
  next();
};
