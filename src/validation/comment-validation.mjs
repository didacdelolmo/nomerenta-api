import { celebrate, Joi } from "celebrate";

export const validateId = (req, res, next) => {
  celebrate({
    params: {
      id: Joi.string().required(),
    },
  })(req, res, next);
};
