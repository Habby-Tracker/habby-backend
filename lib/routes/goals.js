const { Router } = require('express');
const Goal = require('../models/Goal');
const authorize = require('../middleware/authorizeGoal');
const { createHabits, deleteHabits } = require('../services/GoalService');

module.exports = Router()
  .post('/', async ({ body, user }, res, next) => {
    try {
      const goal = await Goal.insert({ ...body, user_id: user.id });
      const habits = await createHabits(goal);
      res.json({ goal, habits });
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
      await Goal.updateById(req.params.id, req.user.id, req.body);
      const updatedGoal = await Goal.getById(req.params.id);
      res.json(updatedGoal);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', authorize, async (req, res, next) => {
    try {
      const habits = await deleteHabits(req.params.id);
      const goal = await Goal.delete(req.params.id);
      res.json({ goal, habits });
    } catch (e) {
      next(e);
    }
  });
