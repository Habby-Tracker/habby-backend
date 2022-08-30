const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
// middleware imports
const notFound = require('./middleware/not-found');
const error = require('./middleware/error');
const authenticate = require('./middleware/authenticate');
// route imports
const user = require('./routes/user');
const goals = require('./routes/goals');
const habits = require('./routes/habits');
const moods = require('./routes/moods');
const categories = require('./routes/categories');
const timePeriods = require('./routes/time-periods');
const status = require('./routes/status');
const habitTypes = require('./routes/habit-types');

// Built in middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:7891',
      'http://localhost:7890',
      'https://habby-backend-db.herokuapp.com',
      'https://marvelous-liger-54b8c9.netlify.app',
    ],
    credentials: true,
  })
);

// App routes
// Auth route
app.use('/api/v1/user', user);
// CRUD routes
app.use('/api/v1/goals', authenticate, goals);
app.use('/api/v1/habits', authenticate, habits);
app.use('/api/v1/moods', authenticate, moods);
// CRD route
app.use('/api/v1/categories', authenticate, categories);
// Read-only routes
app.use('/api/v1/time-periods', timePeriods);
app.use('/api/v1/status', status);
app.use('/api/v1/habit-types', habitTypes);



// Error handling & 404 middleware for when
// a request doesn't match any app routes error
app.use(notFound);
app.use(error);

module.exports = app;
