import { celebrate, Joi } from 'celebrate';
import IdentifiedError from '../errors/identified-error.mjs';
import ErrorCode from '../errors/error-code.mjs';

export const validateAuthInput = (req, res, next) => {
  celebrate({
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
    },
  })(req, res, next);
};

/** Must be used AFTER avatar multer upload middleware */
export const validateAvatarInput = (req, res, next) => {
  if (!req.file) {
    throw new IdentifiedError(ErrorCode.IMAGE_REQUIRED, 'Es necesario subir una imágen');
  }
  next();
};
