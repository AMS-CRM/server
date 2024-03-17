const asyncHandler = require("express-async-handler");
const projectModel = require("../../models/project.model");
const genApiKey = require("../../utils/genApiKey");
const { validationResult } = require("express-validator");

// Constroller to create a new project
const createProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).setCode(3253).setPayload(errors.array());
    throw new Error(errors);
  }

  try {
    // Check if the project exists with the same name
    const checkProject = await projectModel.findOne({
      user: req.user._id,
      name: req.body.name,
    });

    if (checkProject) {
      throw new Error("Project already exists");
    }

    // Generate project unique API key
    const apiKey = await genApiKey();

    const createNewProject = await projectModel.create({
      user: req.user._id,
      name: req.body.name,
      key: apiKey,
    });

    if (!createNewProject) {
      throw new Error("Something went wrong when creating a project");
    }

    return res.status(200).setCode(2334).setPayload(createNewProject).respond();
  } catch (error) {
    throw new Error(error);
  }
});

// Controller to list the user projects
const listUserProjects = () => {
  try {
    const list = projectModel.findOne({ user: req.user._id });

    if (!list) {
      res.status(400).setCode(234);
      throw new Error("Cannot find a project");
    }

    return res.status(200).setCode(343).setPayload(list).respond();
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createProject,
  listUserProjects,
};
