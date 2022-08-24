const { Router } = require('express');
const HabitType = require('../models/HabitType');

module.exports = Router()
  .get('/', async ({ user }, res, next) => {
    try {
      const habitTypes = await HabitType.getAll(user.id);
      res.json(habitTypes);
    } catch (e) {
      next(e);
    }
  });
