const { body } = require("express-validator");

const createProject = [
  body("name").notEmpty().withMessage("Project name cannot be empty"),
];

module.exports = {
  createProject,
};
