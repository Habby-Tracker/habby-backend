const { Router } = require('express');
const Habit = require('../models/Habit');
const authorize = require('../middleware/authorizeHabit');

module.exports = Router()
  .post('/', async ({ body, user }, res, next) => {
    try {
      const habit = await Habit.insert({ ...body, user_id: user.id });
      res.json(habit);
    } catch (e) {
      next(e);
    }
  })

  .get('/:id', authorize, async (req, res, next) => {
    try {
      const habit = await Habit.getById(req.params.id);
      res.json(habit);
    } catch (e) {
      next(e);
    }
  })

  .get('/', async ({ user }, res, next) => {
    try {
      const habits = await Habit.getAll(user.id);
      res.json(habits);
    } catch (e) {
      next(e);
    }
  })

  .put('/:id', authorize, async (req, res, next) => {
    try {
      const habit = await Habit.updateById(
        req.params.id,
        req.user.id,
        req.body
      );
      res.json(habit);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', authorize, async (req, res, next) => {
    try {
      const habit = await Habit.delete(req.params.id);
      res.json(habit);
    } catch (e) {
      next(e);
    }
  });
