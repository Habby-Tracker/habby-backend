const { Router } = require('express');
const Mood = require('../models/Mood');
const authorize = require('../middleware/authorizeMood');

module.exports = Router()
  .post('/', async ({ body, user }, res, next) => {
    try {
      const mood = await Mood.insert({ ...body, user_id: user.id });
      res.json(mood);
    } catch (e) {
      next(e);
    }
  })

  .get('/:id', authorize, async (req, res, next) => {
    try {
      const mood = await Mood.getById(req.params.id);
      res.json(mood);
    } catch (e) {
      next(e);
    }
  })

  .get('/', async ({ user }, res, next) => {
    try {
      const moods = await Mood.getAll(user.id);
      res.json(moods);
    } catch (e) {
      next(e);
    }
  })

  .put('/:id', authorize, async (req, res, next) => {
    try {
      const mood = await Mood.updateById(req.params.id, req.user.id, req.body);
      res.json(mood);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', authorize, async (req, res, next) => {
    try {
      const mood = await Mood.delete(req.params.id);
      res.json(mood);
    } catch (e) {
      next(e);
    }
  });
