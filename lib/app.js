const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const user = require('./routes/user');
const notFound = require('./middleware/not-found');
const error = require('./middleware/error');
const authenticate = require('./middleware/authenticate');
const goals = require('./routes/goals');
const habits = require('./routes/habits');
const moods = require('./routes/moods');
const categories = require('./routes/categories');
const timePeriods = require('./routes/time-periods');
const status = require('./routes/status');
const app = express();
const habitTypes = require('./routes/habitTypes');

// Built in middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://alchademy.herokuapp.com',
      'https://alchademy.netlify.app',
    ],
    credentials: true,
  })
);


// App routes
app.use('/api/v1/user', user);
app.use('/api/v1/goals', authenticate, goals);
app.use('/api/v1/habits', authenticate, habits);
app.use('/api/v1/moods', authenticate, moods);
app.use('/api/v1/categories', authenticate, categories);
app.use('/api/v1/time-periods', timePeriods);
app.use('/api/v1/status', status);
app.use('/api/v1/habitTypes', habitTypes);



// Error handling & 404 middleware for when
// a request doesn't match any app routes error
app.use(notFound);
app.use(error);

module.exports = app;
