import express from 'express';
import isAuthenticated from '../middleware/is-authenticated.mjs';
import { validateUpdateReplacementsInput } from '../validation/replacement-validation.mjs';
import ReplacementModel from '../models/replacement-model.mjs';
import UserModel from '../models/user-model.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import ErrorCode from '../errors/error-code.mjs';

const router = express.Router();

router.get('/replacements', async (req, res, next) => {
  try {
    res.send(await ReplacementModel.findOne());
  } catch (error) {
    next(error);
  }
});

router.put(
  '/replacements',
  isAuthenticated,
  validateUpdateReplacementsInput,
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.session.userId);
      if (!user) {
        next(
          new IdentifiedError(ErrorCode.INVALID_USER, 'Este usuario no existe')
        );
      }

      const role = user.role;
      if (!role.canUpdateReplacements) {
        next(
          new IdentifiedError(
            ErrorCode.INSUFFICIENT_PERMISSIONS,
            'No tienes permisos para realizar esta acción'
          )
        );
      }

      const { replacements } = req.body;

      // Matches the first document
      const updatedReplacements = await ReplacementModel.findOneAndUpdate(
        {},
        { replacements },
        { new: true, upsert: true }
      );

      res.send(updatedReplacements);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
