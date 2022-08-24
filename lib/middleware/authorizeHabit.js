const Habit = require('../models/Habit');

module.exports = async (req, res, next) => {
  try {
    const habit = await Habit.getById(req.params.id);
    if (!habit || habit.user_id !== req.user.id) {
      throw new Error('You do not have access to view this page');
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
