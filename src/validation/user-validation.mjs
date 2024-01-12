import { celebrate, Joi } from 'celebrate';

export const validateAuthInput = (req, res, next) => {
  celebrate({
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
    },
  })(req, res, next);
};

export const validateAvatarInput = (req, res, next) => {
  celebrate({
    body: {
      avatar: Joi.any().required(),
    },
  })(req, res, next);
};
