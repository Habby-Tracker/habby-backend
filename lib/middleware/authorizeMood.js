const Mood = require('../models/Mood');

module.exports = async (req, res, next) => {
  try {
    const mood = await Mood.getById(req.params.id);
    if (!mood || mood.user_id !== req.user.id) {
      throw new Error('You do not have access to view this page');
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
