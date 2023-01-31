var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose')
const userRoutes = require('./routes/user');

var indexRouter = require('./routes/index');
var developersRouter = require('./routes/developers')
var userRouter = require("./routes/landing")
var mapRouter = require('./routes/map')
var relationshipsRouter = require('./routes/relationship')

var mapRouter = require("./routes/map");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/developers', developersRouter)
app.use('/map', mapRouter);
app.use('/map/relationship', relationshipsRouter)

app.use("/landing", userRouter);
app.get('/pg1ex', userRouter);
app.get('/pg2ex', userRouter);

app.use('/user', userRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
