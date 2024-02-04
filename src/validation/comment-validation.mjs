import { celebrate, Joi } from 'celebrate';

export const validateCreateCommentInput = (req, res, next) => {
  celebrate({
    body: {
      postId: Joi.string().required(),
      content: Joi.string().required(),
      parentId: Joi.string(),
    },
  })(req, res, next);
};
