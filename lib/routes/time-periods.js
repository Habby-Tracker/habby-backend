const { Router } = require('express');
const TimePeriod = require('../models/TimePeriod');

module.exports = Router().get('/', async (req, res, next) => {
  try {
    const allTimePeriods = await TimePeriod.getAll();
    res.json(allTimePeriods);
  } catch (e) {
    next(e);
  }
});
