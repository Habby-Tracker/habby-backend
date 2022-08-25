const Category = require('../models/Category');

module.exports = async (req, res, next) => {
  try {
    const category = await Category.getById(req.params.id);
    if (!category || category.user_id !== req.user.id) {
      throw new Error('You do not have access to view this page');
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
