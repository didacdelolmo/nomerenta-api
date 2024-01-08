import { celebrate, Joi } from 'celebrate';

export const validateAvatarInput = (req, res, next) => {
  celebrate({
    body: {
      avatar: Joi.any().required(),
    },
  })(req, res, next);
};
