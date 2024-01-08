/** try-catch wrapper for route controllers and ease of error handling */
export const tryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res);
  } catch (error) {
    next(error);
  }
};
