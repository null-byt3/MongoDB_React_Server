import MongoHandler from './Mongo/MongoHandler.js';

import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import testAPIRouter from './routes/testAPI.js';
import login from './routes/login.js';
import entries from "./routes/entries.js";
import signup from "./routes/signup.js";


export const app = express();
const __dirname = path.resolve();

// Create MongoDB Client Connection
const MongoInstance = new MongoHandler();
try {
  await MongoInstance.init();
} catch (err) {
  console.log('Error Connecting to Mongo:', err)
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/testAPI', testAPIRouter);
app.use('/login', login);
app.use('/entries', entries);
app.use('/signup', signup)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});