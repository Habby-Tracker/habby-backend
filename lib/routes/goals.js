const { Router } = require('express');
const Goal = require('../models/Goal');
// const authorizeGoal = require('../middleware/authorize');

module.exports = Router()
  .post('/', async ({ body, user }, res, next) => {
    try {
      const item = await Goal.insert({ ...body, user_id: user.id });
      res.json(item);
    } catch (e) {
      next(e);
    }
  })
  
  .get('/:id', async (req, res, next) => {
    try {
      const item = await Goal.getById(req.params.id);
      res.json(item);
    } catch (e) {
      next(e);
    }
  })
  
  .get('/', async ({ user }, res, next) => {
    try {
      const items = await Goal.getAll(user.id);
      res.json(items);
    } catch (e) {
      next(e);
    }
  })
  
  .put('/:id', async (req, res, next) => {
    try {
      const item = await Goal.updateById(req.params.id, req.user.id, req.body);
      res.json(item);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', async (req, res, next) => {
    try {
      const item = await Goal.delete(req.params.id);
      res.json(item);
    } catch (e) {
      next(e);
    }
  });
