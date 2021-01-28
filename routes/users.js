const express = require("express");
const router = express.Router();
const { User } = require("../models");

// get authenticated user
router.get("/", (req, res) => {
  const user = req.currentUser;

  res.status(200).json({ emailAddress: user.emailAddress });
});

// create new user
router.post("/", async (req, res) => {
  try {
    await User.create(req.body);

    res.location("/");
    res.status(201).end();
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
