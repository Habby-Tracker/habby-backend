const { Router } = require('express');
const HabitType = require('../models/HabitType');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try{
      const habitTypes = await HabitType.getAll();
      res.json(habitTypes);  
    }catch (e){
      next(e);
    }
  });
