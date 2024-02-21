import { celebrate, Joi } from 'celebrate';

export const validateCreateInvitationsInput = (req, res, next) => {
  celebrate({
    body: {
      email: Joi.string().required(),
    },
  })(req, res, next);
};
