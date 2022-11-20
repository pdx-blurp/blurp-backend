const express = require("express");
const ejs = require('ejs')
const app = express();

//setting the view engine to ejs
app.set("view engine", "ejs");

app.get("/home", (req, res) => {
  //rendering index.ejs page
  res.render("index", { text: "hello world" });
});

const userRouter = require("./routes/landing")

app.use("/landing", userRouter)

app.get('/pg1ex', userRouter)
app.get('/pg2ex', userRouter)

app.listen(3000);
