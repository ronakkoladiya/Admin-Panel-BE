const Project = require("../Models/ProjectSchema");
const constant = require("../Utils/constant");
const { schemaErrorResponse } = require("../Utils/error/schemaError");
const handleErrorResponse = require("../Utils/error/handleErrorResponse");
const { projectBodySchema } = require("../Utils/validation/BodySchema");
const ProjectResource = require("../Resources/ProjectResource");

const getProject = async (req, res) => {
  try {
    if (req.user.userType === "admin") {
      const query = req.query.id ? { _id: req.query.id } : {};
      var projects = await Project.find(query).sort({ $natural: -1 });
    } else {
      const query = req.query.id ? { _id: req.query.id } : {};
      var projects = await Project.find(query).sort({ $natural: -1 });
    }

    const response = await ProjectResource(projects);
    res.send(response);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const createOrUpdateProject = async (req, res, isCreate = true) => {
  try {
    const { value, error: validationError } = projectBodySchema.validate(
      req.body,
      {
        abortEarly: false,
      }
    );
    if (validationError) {
      return schemaErrorResponse({ res, error: validationError });
    }

    const projectData = {
      projectName: value.projectName,
      client: value.client,
      startDate: value.startDate,
      endDate: value.endDate,
      status: value.status,
      technology: value.technology,
      teamLeader: value.teamLeader,
      teamMembers: value.teamMembers,
      description: value.description,
    };

    if (isCreate) {
      await Project.create(projectData);
      res.status(200).json({
        message: constant.SUCCESS.DATA_ADD_SUCCESSFULLY_MESSAGE,
      });
    } else {
      await Project.updateOne({ _id: req.query.id }, projectData);
      res.status(200).json({
        message: constant.SUCCESS.DATA_UPDATE_SUCCESSFULLY_MESSAGE,
      });
    }
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const createProject = async (req, res) => {
  await createOrUpdateProject(req, res);
};

const updateProject = async (req, res) => {
  await createOrUpdateProject(req, res, false);
};

const getAllProjectName = async (req, res) => {
  try {
    const projects = await Project.find().select(
      "_id projectName teamLeader teamMembers"
    );

    const filteredProjects = projects.filter((project) => {
      const teamMemberArray = project.teamMembers;
      const teamLeaderArray = project.teamLeader;
      return (
        teamMemberArray.includes(req.user._id) ||
        teamLeaderArray.includes(req.user._id)
      );
    });

    const mapProjects = filteredProjects.map((project) => {
      const { _id, projectName } = project;
      return { _id, projectName };
    });

    res.json(mapProjects);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

module.exports = {
  getProject,
  createProject,
  updateProject,
  getAllProjectName,
};
