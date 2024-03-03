import express from 'express';
import { uploadImage } from '../middleware/upload-image.mjs';
import { validateImageInput } from '../validation/image-validation.mjs';
import isAuthenticated from '../middleware/is-authenticated.mjs';
import UserModel from '../models/user-model.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import ErrorCode from '../errors/error-code.mjs';
import sanitize from 'sanitize-filename';
import { fileURLToPath } from 'url';
import { dirname, extname, resolve } from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

const router = express.Router();

router.post(
  '/images',
  isAuthenticated,
  uploadImage,
  validateImageInput,
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.session.userId);
      if (!user) {
        throw new IdentifiedError(
          ErrorCode.INVALID_USER,
          'Este usuario no existe'
        );
      }

      const role = user.role;
      if (!role.canUploadImage) {
        throw new IdentifiedError(
          ErrorCode.INSUFFICIENT_PERMISSIONS,
          'No tienes permisos para realizar esta acción'
        );
      }

      const image = req.file;
      if (image.size > 2 * (1024 * 1024)) {
        throw new IdentifiedError(
          ErrorCode.IMAGE_TOO_BIG,
          'La imagen no puede pesar más de 2MB'
        );
      }

      const sanitizedImage = sanitize(image.originalname);

      const pathString = fileURLToPath(import.meta.url);
      const dirString = dirname(pathString);

      const hash = crypto
        .createHash('sha256')
        .update(sanitizedImage)
        .digest('hex');

      const extension = extname(sanitizedImage).toLowerCase();
      const fileName = `${Date.now()}-${hash}${extension}`;

      // Must create this folder first otherwise it throws error on production
      const absolutePath = resolve(
        dirString,
        `../../assets/images/${fileName}`
      );

      let processedImage = sharp(image.buffer);

      if (extension === '.jpg' || extension === '.jpeg') {
        processedImage = processedImage.jpeg({ quality: 80 });
      }

      const resizeResult = await processedImage.toFile(absolutePath);

      if (resizeResult.size > 2 * 1024 * 1024) {
        throw new IdentifiedError(
          ErrorCode.IMAGE_TOO_BIG,
          'La imagen no puede pesar más de 2MB'
        );
      }

      res.send({ image: fileName });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
