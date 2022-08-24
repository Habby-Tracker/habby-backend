const Goal = require('../models/Goal');

module.exports = async (req, res, next) => {
  try {
    const goal = await Goal.getById(req.params.id);
    if (!goal || goal.user_id !== req.user.id) {
      throw new Error('You do not have access to view this page');
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};

// Compare this snippet from lib/routes/items.js

