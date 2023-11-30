const BankDetails = require("../Models/BankDetailsSchema");
const { createBankDetailsSchema } = require("../Utils/validation/BodySchema");
const { schemaErrorResponse } = require("../Utils/error/schemaError");
const handleErrorResponse = require("../Utils/error/handleErrorResponse");
const constant = require("../Utils/constant");

const validateBankDetails = (data) => {
  return createBankDetailsSchema.validate(data, {
    abortEarly: false,
    errors: { wrap: { label: '"' } },
  });
};

const createBankDetails = async (req, res) => {
  try {
    const { value, error: validationError } = validateBankDetails(req.body);
    if (validationError) {
      return schemaErrorResponse({ res, error: validationError });
    }
    const getBankInfo = await BankDetails.findOne({ userId: value.userId });
    console.log(getBankInfo);
    if (getBankInfo) {
      await BankDetails.updateOne({ userId: value.userId }, value);
      res
        .status(200)
        .json({ message: constant.SUCCESS.DATA_UPDATE_SUCCESSFULLY_MESSAGE });
    } else {
      await BankDetails.create(value);
      res
        .status(200)
        .json({ message: constant.SUCCESS.DATA_ADD_SUCCESSFULLY_MESSAGE });
    }
  } catch (err) {
    handleErrorResponse(res, err);
  }
};



const getUserBankDetails = async (req, res) => {
  try {
    const bankDetails = await BankDetails.findOne({ userId: req.query.userId });
    res.send(bankDetails);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

module.exports = { createBankDetails, getUserBankDetails };
