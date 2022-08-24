const { Router } = require('express');
const Goal = require('../models/Goal');
const authorize = require('../middleware/authorizeGoal');

module.exports = Router()
  .post('/', async ({ body, user }, res, next) => {
    try {
      const goal = await Goal.insert({ ...body, user_id: user.id });
      res.json(goal);
    } catch (e) {
      next(e);
    }
  })
  
  .get('/:id', async (req, res, next) => {
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

  .delete('/:id', async (req, res, next) => {
    try {
      const goal = await Goal.delete(req.params.id);
      res.json(goal);
    } catch (e) {
      next(e);
    }
  });
