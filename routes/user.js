"use strint";

const express = require("express");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");
const { User } = require("../models");

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;

    res.json({
      name: user.name,
      username: user.username,
    });
  })
);

// Route that creates a new user.
router.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      await User.create({ firstName, lastName, email, password });
      res.status(201).json({ message: "Account successfully created!" });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
