const express = require("express");
const bodyParser = require("body-parser");

const userRoute = require("./routes/pug.route");

const app = express();

app.set("view engine", "pug");
app.set("views", "./views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/pugs", userRoute);

app.listen(3000);
