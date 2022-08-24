const { Router } = require('express');
const Category = require('../models/Category');

module.exports = Router()
  .get('/', async (req, res, next) => {
    console.log('req', req.user);
    try{
      const allCategories = await Category.getAll(req.user.id);
      res.json(allCategories);  
    }catch (e){
      next(e);
    }
  })
  
  .post('/', async ({ user, body }, res, next) => {
    try{
      const userCategories = await Category.insert({ ...body, user_id: user.id });
      res.json(userCategories);
    }catch(e){
      next(e);
    }
  })
  
;
