const { Router } = require('express');
const Status = require('../models/Status');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try{
      const statuses = await Status.getAll();
      res.json(statuses);  
    }catch (e){
      next(e);
    }
  });
