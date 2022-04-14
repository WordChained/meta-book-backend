const createError = require('http-errors');
require('dotenv').config()
// console.log("process.env:", process.env)
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const cors = require('cors')

const authRoutes = require('./api/auth/auth-routes');
const userRoutes = require('./api/user/user-routes');
const itemRoutes = require('./api/item/item-routes');
const friendsRoutes = require('./api/friends/friends-routes');
const cloudinaryRoutes = require('./api/cloudinary/cloudinary-routes');
const notificationRoutes = require('./api/notification/notification-routes');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}
app.use(allowCrossDomain)

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/item', itemRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/notification', notificationRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});


// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
