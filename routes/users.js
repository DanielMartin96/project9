const express = require("express");
const router = express.Router();

const { User } = require("../models");
const { authenticateUser } = require("../middleware/auth-user");

// get authenticated user
router.get("/", authenticateUser, async (req, res) => {
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
    console.log("ERROR: ", err.name);

    if (
      err.name === "SequelizeValidationError" ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      const errors = err.errors.map((err) => err.message);
      res.status(400).json({ errors });
    } else {
      throw err;
    }
  }
});

module.exports = router;
