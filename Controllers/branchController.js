const Branch = require("../Models/BranchSchema");
const constant = require("../Utils/constant");
const { schemaErrorResponse } = require("../Utils/error/schemaError");
const handleErrorResponse = require("../Utils/error/handleErrorResponse");
const { convertFieldName } = require("../Utils/error/schemaError");
const { branchBodySchema } = require("../Utils/validation/BodySchema");

const getBranch = async (req, res) => {
  try {
    const query = req.query.id ? { _id: req.query.id } : {};
    const branches = await Branch.find(query).select(
      "-createdAt -updatedAt -__v "
    );
    res.send(branches);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const createBranch = async (req, res) => {
  try {
    const { value, error: validationError } = branchBodySchema.validate(
      req.body,
      {
        abortEarly: false,
        errors: { wrap: { label: '"' } },
      }
    );
    if (validationError) {
      return schemaErrorResponse({ res, error: validationError });
    }

    const branchData = {
      branchName: value.branchName,
      location: value.location,
      contact: value.contact,
      email: value.email,
    };

    if (value.accessories && value.accessories.length > 0) {
      branchData.accessories = value.accessories.map((accessory) => ({
        accessoriesId: accessory.accessoriesId,
        total: accessory.total,
      }));
    }
    try {
      await Branch.create(branchData);
    } catch (error) {
      if (error.code === 11000) {
        const uniqueField = await convertFieldName(
          Object.keys(error.keyValue)[0]
        );
        const errorMessage = `${uniqueField} ${constant.ERROR.UNIQUE_FIELD_MESSAGE}`;
        return res.status(400).json({
          requestBodyError: {
            [Object.keys(error.keyValue)[0]]: errorMessage,
          },
        });
      }
      throw error;
    }

    res
      .status(200)
      .json({ message: constant.SUCCESS.DATA_ADD_SUCCESSFULLY_MESSAGE });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const updateBranch = async (req, res) => {
  try {
    const { value, error: validationError } = branchBodySchema.validate(
      req.body,
      {
        abortEarly: false,
      }
    );
    if (validationError) {
      return schemaErrorResponse({ res, error: validationError });
    }

    const branchData = {
      branchName: value.branchName,
      location: value.location,
      contact: value.contact,
      email: value.email,
    };

    if (
      Array.isArray(value.accessories) &&
      (value.accessories.length > 0 || value.accessories.length === 0)
    ) {
      branchData.accessories = value.accessories.map((accessory) => ({
        accessoriesId: accessory.accessoriesId,
        total: accessory.total,
      }));
    }
    // Find the branch by its ID and update it with the new data
    await Branch.updateOne({ _id: req.query.id }, branchData);

    res
      .status(200)
      .json({ message: constant.SUCCESS.DATA_UPDATE_SUCCESSFULLY_MESSAGE });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const branchDelete = async (req, res) => {
  try {
    await Branch.findByIdAndDelete(req.query.id);
    res
      .status(200)
      .json({ message: constant.SUCCESS.DATA_DELETE_SUCCESSFULLY_MESSAGE });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

module.exports = { getBranch, createBranch, updateBranch, branchDelete };
