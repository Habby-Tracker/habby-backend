const { Router } = require('express');
const Category = require('../models/Category');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try{
      const allCategories = await Category.getAll();
      res.json(allCategories);  
    }catch (e){
      next(e);
    }
  })
  
  
;
