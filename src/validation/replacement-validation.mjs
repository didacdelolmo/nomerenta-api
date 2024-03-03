import { celebrate, Joi } from 'celebrate';

export const validateUpdateReplacementsInput = (req, res, next) => {
  celebrate({
    body: {
      replacements: Joi.array().items(
        Joi.object({
          originalText: Joi.string().required(),
          replacement: Joi.string().required(),
        })
      ),
    },
  })(req, res, next);
};
