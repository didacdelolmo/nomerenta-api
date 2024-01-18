import { celebrate, Joi } from 'celebrate';

export const validateCreatePostInput = (req, res, next) => {
  celebrate({
    body: {
      title: Joi.string().required(),
      content: Joi.string().required(),
    },
  })(req, res, next);
};

export const validateGetAllPostsInput = (req, res, next) => {
  celebrate({
    params: {
      sortBy: Joi.string(),
      start: Joi.number(),
      limit: Joi.number(),
    },
  })(req, res, next);
};
