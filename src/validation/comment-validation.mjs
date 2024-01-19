import { celebrate, Joi } from 'celebrate';

export const validateCreateCommentInput = (req, res, next) => {
  celebrate({
    body: {
      postId: Joi.string().required(),
      parentId: Joi.string(),
      content: Joi.string().required(),
    },
  })(req, res, next);
};
