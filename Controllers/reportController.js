const Report = require("../Models/ReportSchema");
const constant = require("../Utils/constant");
const { schemaErrorResponse } = require("../Utils/error/schemaError");
const handleErrorResponse = require("../Utils/error/handleErrorResponse");
const { reportBodySchema } = require("../Utils/validation/BodySchema");
const { ObjectId } = require("mongodb");

const calculateTotalMinutes = (projects) => {
  return projects.reduce((total, project) => {
    const projectHours = project.hours || 0;
    const projectMinutes = project.minutes || 0;
    return total + projectHours * 60 + projectMinutes;
  }, 0);
};

const createReport = async (req, res) => {
  try {
    const { value, error: validationError } = reportBodySchema.validate(
      req.body,
      { abortEarly: false }
    );

    if (validationError) {
      return schemaErrorResponse({ res, error: validationError });
    }

    const totalMinutes = calculateTotalMinutes(value.project);

    const reportData = {
      reportDate: value.reportDate,
      employeeId: value.employeeId,
      totalTime: `${totalMinutes}`,
      project: value.project.map((project) => ({
        projectId: project.projectId,
        hours: project.hours || 0,
        minutes: project.minutes || 0,
        description: project.description,
      })),
    };

    const existingReport = await Report.findOne({
      reportDate: new Date(value.reportDate),
      employeeId: new ObjectId(value.employeeId),
    });

    if (existingReport) {
      return res.status(400).json({
        message: constant.VALIDATION.REPORT_ALREADY_EXISTS,
      });
    }

    await Report.create(reportData);

    res.status(200).json({
      message: constant.SUCCESS.DATA_ADD_SUCCESSFULLY_MESSAGE,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const getEmployeeReport = async (req, res) => {
  try {
    const populateOptions = {
      path: "project.projectId",
      select: "_id projectName startDate endDate",
    };

    const { userType, _id } = req.user;
    const { projectId, startDate, endDate, reportDate, employeeId } = req.query;

    let reportQuery = Report.find()
      .populate("employeeId", "_id firstName")
      .populate(populateOptions)
      .select("-updatedAt -createdAt -__v");

    if (userType === "employee") {
      reportQuery = reportQuery.where({ employeeId: _id });
      const reports = await reportQuery.exec();
      res.send(reports);
    } else {
      if (employeeId) {
        reportQuery = reportQuery.where({ employeeId });
      }

      if (projectId) {
        reportQuery = reportQuery.where(
          "project.projectId",
          new ObjectId(projectId)
        );
      }

      if (reportDate) {
        reportQuery = reportQuery.where("reportDate", new Date(reportDate));
      }

      let reports = await reportQuery.exec();

      if (projectId) {
        reports = reports.filter((report) =>
          report.project.some(
            (proj) =>
              proj.projectId._id.toString() === projectId &&
              (!startDate || proj.projectId.startDate >= new Date(startDate)) &&
              (!endDate || proj.projectId.endDate <= new Date(endDate))
          )
        );

        if (reports.length === 0) {
          return res.status(400).json({
            message: constant.VALIDATION.PROJECT_NOT_FOUND_SPECIFIED_DATE,
          });
        }
      }

      // Clean up the report objects
      reports = reports.map((report) => {
        if (projectId) {
          report.project = report.project.filter(
            (proj) => proj.projectId._id.toString() === projectId
          );
        }
        return report;
      });

      reports = reports.filter((report) => report.project.length > 0);
      if (reports.length === 0) {
        return res.status(400).json({
          message: constant.VALIDATION.EMPLOYEE_REPORT_NOT_FOUND,
        });
      }
      res.send(reports);
    }
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

module.exports = {
  createReport,
  getEmployeeReport,
};
