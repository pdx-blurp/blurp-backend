let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

// goole Oauth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '220935592619-e7j93usk2h7vhcuoauos59rhgvqlcmsa.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

let indexRouter = require('./routes/index');
let userRouter = require("./routes/landing")

let mapRouter = require("./routes/map");
let relationshipsRouter = require('./routes/relationship')
let nodesRouter = require('./routes/node')
let developersRouter = require('./routes/developers')

// google Oauth routes
let googleOauthRouter = require('./routes/googleOauth');

let app = express();

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
app.use('/map', mapRouter)
app.use('/map/relationship', relationshipsRouter)
app.use('/map/node', nodesRouter)

app.use('/', googleOauthRouter)

app.use("/landing", userRouter);
app.get('/pg1ex', userRouter);
app.get('/pg2ex', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

module.exports = app;
