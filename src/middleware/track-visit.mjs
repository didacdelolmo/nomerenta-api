import VisitModel from '../models/visit-model.mjs';
import { authenticated } from '../utils/auth.mjs';

export const trackVisit = async (req, res, next) => {
  if (!authenticated(req)) {
    return next();
  }

  try {
    const userId = req.session.userId;

    const date = new Date();
    const visit = await VisitModel.findOne({ user: userId }).sort({
      startDate: -1,
    });

    if (visit) {
      const timeDifference = (date - visit.lastActionDate) / (60 * 1000);
      if (timeDifference <= visit.durationFactor) {
        visit.lastActionDate = date;
        await visit.save();
      }
      return next();
    }

    await VisitModel.create({ user: userId });
    next();
  } catch (error) {
    next(error);
  }
};
