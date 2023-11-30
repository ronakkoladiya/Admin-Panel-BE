const Accessories = require("../Models/AccessoriesSchema");
const handleErrorResponse = require("../Utils/error/handleErrorResponse");
const { schemaErrorResponse } = require("../Utils/error/schemaError");
const { AccessoriesBodySchema } = require("../Utils/validation/BodySchema");
const constant = require("../Utils/constant");

const createAccessories = async (req, res) => {
  try {
    const { value, error: validationError } = AccessoriesBodySchema.validate(
      req.body,
      {
        abortEarly: false,
        errors: { wrap: { label: '"' } },
      }
    );
    if (validationError) {
      return schemaErrorResponse({ res, error: validationError });
    }

    await Accessories.create({ name: value.name });

    res
      .status(200)
      .json({ message: constant.SUCCESS.DATA_ADD_SUCCESSFULLY_MESSAGE });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const getAccessories = async (req, res) => {
  try {
    const data = await Accessories.find().select("_id name");
    res.send(data);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

module.exports = { createAccessories , getAccessories};
