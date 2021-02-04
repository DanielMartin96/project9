const express = require("express");
const router = express.Router();
const { Course } = require("../models");
const { authenticateUser } = require("../middleware/auth-user");

// get courses
router.get("/", async (req, res) => {
  const courses = await Course.findAll();

  res.status(200).json(courses);
});

// create new course
router.post("/", authenticateUser, async (req, res) => {
  try {
    await Course.create(req.body);

    res.location(`api/courses/${req.path}`);
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

// get course with id
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findByPk(req.path.substring(1));

    res.status(200).json(course);
  } catch (err) {
    console.error(err);
  }
});

// edit course with id
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    await Course.update(req.body, {
      where: { id: req.path.substring(1) },
    });

    res.status(204).json();
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

// delete course with id
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const course = await Course.findByPk(req.path.substring(1));

    course.destroy();

    res.status(204);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
