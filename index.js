const express = require("express");
const app = express();

//setting the view engine to ejs
app.set("view engine", "ejs");

app.get("/home", (req, res) => {
  //rendering index.ejs page
  res.render("index", { text: "hello world" });
});
app.listen(3000);
