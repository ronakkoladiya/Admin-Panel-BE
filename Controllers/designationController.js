const Designation = require("../Models/DesignationSchema");
const constant = require("../Utils/constant");
const { schemaErrorResponse } = require("../Utils/error/schemaError");
const handleErrorResponse = require("../Utils/error/handleErrorResponse");
const { designationBodySchema } = require("../Utils/validation/BodySchema");

const getDesignation = async (req, res) => {
  try {
    const designationData = await Designation.find().select("_id name");
    res.json({ data: designationData });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const createDesignation = async (req, res) => {
  try {
    const { value, error: validationError } = designationBodySchema.validate(
      req.body,
      {
        abortEarly: false,
        errors: { wrap: { label: '"' } },
      }
    );
    if (validationError) {
      return schemaErrorResponse({ res, error: validationError });
    }

    await Designation.create({ name: value.name });

    res
      .status(200)
      .json({ message: constant.SUCCESS.DATA_ADD_SUCCESSFULLY_MESSAGE });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const deleteDesignation = async (req, res) => {
  try {
    await Designation.findByIdAndDelete(req.query.id);
    res
      .status(200)
      .json({ message: constant.SUCCESS.DATA_DELETE_SUCCESSFULLY_MESSAGE });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

module.exports = { getDesignation, createDesignation, deleteDesignation };
