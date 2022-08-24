const { Router } = require('express');
const Category = require('../models/Category');

module.exports = Router()
//gets all categories per user
  .get('/', async (req, res, next) => {
    try{
      const allCategories = await Category.getAll(req.user.id);
      res.json(allCategories);  
    }catch (e){
      next(e);
    }
  })

  //gets a specific category by category id
  .get('/:id', async (req, res, next) => {
    try{
      const category = await Category.getByID(req.params.id);
      res.json(category);
    }catch(e){
      next(e);
    }
  })
  
  //adds a new category associated to the user
  .post('/', async ({ user, body }, res, next) => {
    try{
      const userCategories = await Category.insert({ ...body, user_id: user.id });
      res.json(userCategories);
    }catch(e){
      next(e);
    }
  })

  //removes a category from the category table
  .delete('/:id', async (req, res, next) => {
    try{
      const category = await Category.delete(req.params.id);
      res.json(category);
    }catch(e){
      next(e);
    }
  })
;
