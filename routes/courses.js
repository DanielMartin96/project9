const express = require("express");
const router = express.Router();
const { User, Course } = require("../models");
const { authenticateUser } = require("../middleware/auth-user");
const auth = require("basic-auth");

// get courses
router.get("/", async (req, res) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "firstName", "lastName", "emailAddress"],
      },
    ],
    attributes: [
      "id",
      "title",
      "description",
      "estimatedTime",
      "materialsNeeded",
    ],
  });
  console.log(courses);
  res.status(200).json(courses);
});

// create new course
router.post("/", authenticateUser, async (req, res) => {
  try {
    const credentials = auth(req);
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name,
      },
    });
    const userId = user.id;
    req.body.userId = userId;

    const newCourse = await Course.create(req.body);
    res.location(`/courses/${newCourse.id}`).status(201).end();
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
    const course = await Course.findByPk(req.params.id);
    const user = await User.findByPk(course.userId);

    res.status(200).json({ course: course, user: user.dataValues });
  } catch (err) {
    console.error(err);
  }
});

// edit course with id
router.put("/:id", authenticateUser, async (req, res) => {
  const errors = [];

  if (!req.body.title) {
    errors.push("Please provide a title");
  }

  if (!req.body.description) {
    errors.push("Please provide a description");
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
  } else {
    await Course.update(req.body, {
      where: { id: req.path.substring(1) },
    });

    res.status(204).json();
  }
});

// delete course with id
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const course = await Course.findByPk(req.path.substring(1));

    course.destroy();

    res.status(204).end();
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
