const User = require("../Models/UserSchema");
const Password = require("../Models/PasswordSchema");
const {
  signUpBodySchema,
  loginBodySchema,
  forgotPasswordBodySchema,
  resetPasswordBodySchema,
} = require("../Utils/validation/BodySchema");
const { schemaErrorResponse } = require("../Utils/error/schemaError");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const { forgotPasswordEmail } = require("../Utils/Email/forgotPasswordEmail");
const constant = require("../Utils/constant");
const handleErrorResponse = require("../Utils/error/handleErrorResponse");

const register = async (req, res) => {
  try {
    const { value, error } = signUpBodySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return schemaErrorResponse({ res, error });
    }

    const userIsExist = await User.checkIsExist({ email: value.email });
    if (userIsExist) {
      return res.status(400).json({
        error: constant.ERROR.EMAIL_EXISTS_MESSAGE,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(value.password, salt);

    const user = await User.create({
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      userType: value.userType,
      phone: value.phone,
    });

    const token = await user.generateAuthToken();

    await Password.create({
      password: hashPassword,
      userId: user._id,
    });

    let userDetails = user.toObject();
    delete userDetails.tokens;

    return res.status(200).json({
      message: constant.SUCCESS.REGISTER_MESSAGE,
      user: { userDetails, token },
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const login = async (req, res) => {
  try {
    const { value, error } = loginBodySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return schemaErrorResponse({ res, error });
    }

    const user = await User.findByCredentials(value.email, value.password);
    const token = await user.generateAuthToken();

    let userDetails = user.toObject();
    delete userDetails.tokens;

    res.json({
      message: constant.SUCCESS.LOGIN_MESSAGE,
      user: { userDetails, token },
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { value, error } = forgotPasswordBodySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return schemaErrorResponse({ res, error });
    }

    const userIsExist = await User.checkIsExist({ email: value.email });
    if (!userIsExist) {
      return res
        .status(400)
        .send({ error: constant.ERROR.EMAIL_NOT_EXISTS_MESSAGE });
    }

    const randomString = randomstring.generate();
    await User.updateOne(
      { email: value.email },
      { $set: { resetPasswordToken: randomString } }
    );

    const getUser = await User.findOne({ email: value.email });

    await forgotPasswordEmail(
      getUser.firstName,
      value.email,
      getUser.resetPasswordToken
    );

    res.status(200).json({
      message: constant.SUCCESS.FORGOT_PASSWORD_MESSAGE,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { value, error } = resetPasswordBodySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return schemaErrorResponse({ res, error });
    }

    const token = req.query.token;
    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) {
      return res
        .status(400)
        .json({ error: constant.VALIDATION.INVALID_TOKEN_MESSAGE });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(value.password, salt);

    await Password.updateOne(
      { userId: user._id },
      { $set: { password: hashPassword } }
    );
    await User.updateOne(
      { _id: user._id },
      { $set: { resetPasswordToken: null } }
    );

    res.status(200).json({ message: constant.SUCCESS.RESET_PASSWORD_MESSAGE });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const refreshPage = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const userData = await User.findOne({ "tokens.token": token }).select("-__v -tokens").populate("designation", "_id name")
        .populate("branch", "_id branchName")
        .populate("userRole", "id name");
    res.json(userData);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  refreshPage,
};
