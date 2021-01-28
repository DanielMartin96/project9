const express = require("express");
const router = express.Router();
const { Course } = require("../models");

// get courses
router.get("/", async (req, res) => {
  const courses = await Course.findAll();

  res.status(200).json(courses);
});

// create new user
router.post("/", async (req, res) => {
  try {
    await Course.create(req.body);

    res.location(`api/courses/${req.path}`);
    res.status(201).end();
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
