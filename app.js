let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let session = require("express-session");
let FileStore = require("session-file-store")(session);

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
		store: new FileStore({
			reapInterval: 5, // Remove expired sessions every 60 seconds
		}),
		secret: "some-secret-encryption-key",
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false,
			httpOnly: true,
			maxAge: 1, // Don't save sessions for non-logged in users (1 ms session)
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
