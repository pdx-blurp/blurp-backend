let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let session = require("express-session");

let FRONTEND_URL = "https://blurp-pdx.netlify.app";

let indexRouter = require("./routes/index");
let userRouter = require("./routes/landing");

let mapRouter = require("./routes/map");
let relationshipsRouter = require("./routes/relationship");
let nodesRouter = require("./routes/node");
let groupsRouter = require("./routes/group");
let developersRouter = require("./routes/developers");

let loginRouter = require("./routes/login");
let testLoginRouter = require("./routes/test_login");
let userDataRouter = require("./routes/userdata");

let app = express();

let mongoDBStore = require("connect-mongodb-session")(session);
let store = new mongoDBStore({
	uri: process.env.MONGO_URI,
	databaseName: 'blurp',
	collection: 'sessions',
	expiresAfterSeconds: 3000
});
// Catch mongo store errors
store.on('error', function(error) {
	console.log('Session store error:', error);
})

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser("some-secret-encryption-key"));
app.use(
	session({
		store: store,
		secret: "some-secret-encryption-key",
		resave: false,
		saveUninitialized: true,
		cookie: {
			domain: FRONTEND_URL,
			secure: true,
			httpOnly: true,
			maxAge: 30000, // Don't save sessions for non-logged in users (30 sec session)
		},
	})
);

app.use("/", indexRouter);
app.use("/developers", developersRouter);
app.use("/map", mapRouter);
app.use("/map/relationship", relationshipsRouter);
app.use("/map/node", nodesRouter);
app.use("/map/group", groupsRouter);

app.use("/landing", userRouter);
app.get("/pg1ex", userRouter);
app.get("/pg2ex", userRouter);
app.get("/test_login", userRouter);

app.use("/login", loginRouter);
app.use("/test-login", testLoginRouter);
app.use("/userdata", userDataRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

module.exports = app;
