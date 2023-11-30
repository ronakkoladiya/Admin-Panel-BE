const Technology = require("../Models/TechnologySchema");
const constant = require("../Utils/constant");
const { schemaErrorResponse } = require("../Utils/error/schemaError");
const handleErrorResponse = require("../Utils/error/handleErrorResponse");
const { technologyBodySchema } = require("../Utils/validation/BodySchema");

const getTechnology = async (req, res) => {
  try {
    const technologyData = await Technology.find().select("_id name");
    res.json({ data: technologyData });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const createTechnology = async (req, res) => {
  try {
    const { value, error: validationError } = technologyBodySchema.validate(
      req.body,
      {
        abortEarly: false,
        errors: { wrap: { label: '"' } },
      }
    );
    if (validationError) {
      return schemaErrorResponse({ res, error: validationError });
    }
    await Technology.create({ name: value.name });
    res
      .status(200)
      .json({ message: constant.SUCCESS.DATA_ADD_SUCCESSFULLY_MESSAGE });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const deleteTechnology = async (req, res) => {
  try {
    await Technology.findByIdAndDelete(req.query.id);
    res
      .status(200)
      .json({ message: constant.SUCCESS.DATA_DELETE_SUCCESSFULLY_MESSAGE });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

module.exports = { getTechnology, createTechnology, deleteTechnology };
