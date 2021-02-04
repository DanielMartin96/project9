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
router.put("/:id"),
  async (req, res) => {
    try {
      const course = await Course.update(req.body, {
        where: { id: req.path.substring(1) },
      });

      res.status(204).json(course);
    } catch (err) {
      console.error(err);
    }
  };

// delete course with id
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findByPk(req.path.substring(1));

    course.destroy();

    res.status(204);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
