const express = require("express")
const router = express.Router()
const shortid = require("shortid");

const db = require("../db")

router.get("/", (req, res) => {
  res.render("pugs/index", {
    pugs: db.get("pugs").value()
  });
});

router.get("/search", (req, res) => {
  const { q } = req.query;
  const matchedUser = db
    .get("pugs")
    .value()
    .filter(item => item.name.toLowerCase().indexOf(q.toLowerCase()) !== -1);

  res.render("pugs/index", {
    pugs: matchedUser
  });
});

router.get("/create", (req, res) => {
  res.render("pugs/create");
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  const pug = db
    .get("pugs")
    .find({ id: id })
    .value();

  res.render("pugs/view", {
    val: pug
  });
});

router.post("/create", (req, res) => {
  req.body.id = shortid.generate();
  db.get("pugs")
    .push(req.body)
    .write();
  res.redirect("/pugs");
});

module.exports = router