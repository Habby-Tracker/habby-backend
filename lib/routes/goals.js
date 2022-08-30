const { Router } = require('express');
const Goal = require('../models/Goal');
const Habit = require('../models/Habit');
const authorize = require('../middleware/authorizeGoal');

module.exports = Router()
  .post('/', async ({ body, user }, res, next) => {
    try {
      const goal = await Goal.insert({ ...body, user_id: user.id });
      const todaysDate = new Date();
      await Habit.insert({ habitName: body.habitName, user_id: user.id, dueDate: todaysDate, goalID: goal.id, statusID: 1 });
      res.json(goal);
    } catch (e) {
      next(e);
    }
  })

  .get('/:id', authorize, async (req, res, next) => {
    try {
      const goal = await Goal.getById(req.params.id);
      res.json(goal);
    } catch (e) {
      next(e);
    }
  })

  .get('/', async ({ user }, res, next) => {
    try {
      const goals = await Goal.getAll(user.id);
      res.json(goals);
    } catch (e) {
      next(e);
    }
  })

  .put('/:id', authorize, async (req, res, next) => {
    try {
      const goal = await Goal.updateById(req.params.id, req.user.id, req.body);
      res.json(goal);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', authorize, async (req, res, next) => {
    try {
      const goal = await Goal.delete(req.params.id);
      res.json(goal);
    } catch (e) {
      next(e);
    }
  });
