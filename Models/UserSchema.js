const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Password = require("./PasswordSchema");
const bcrypt = require("bcrypt");
const constant = require("../Utils/constant");

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    middleName: String,
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: constant.VALIDATION.EMAIL_INVALID_MESSAGE,
      },
    },
    phone: {
      type: String,
      match: [/^\d{10}$/, constant.VALIDATION.CONTACT_MESSAGE],
    },
    userType: {
      type: String,
      enum: constant.VALUES.USER_TYPE_ARRAY,
    },
    gender: {
      type: String,
      enum: constant.VALUES.GENDER_ARRAY,
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
    },
    technology:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technology",
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    userRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserRole",
    },
    dateOfBirth: String,
    joinDate: String,
    address: String,
    profilePicture: String,
    dateOfLeaving: {
      type: Date,
      default: null,
    },
    currentProject: String,
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    resetPasswordToken: String,
  },
  { timestamps: true }
);

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error(constant.ERROR.EMAIL_NOT_EXISTS_MESSAGE);
  }

  const passwordObj = await Password.findOne({
    userId: user._id,
    status: true,
  });
  if (!passwordObj) {
    throw new Error(constant.VALIDATION.PASSWORD_NOT_MATCH_MESSAGE);
  }
  if (!(await bcrypt.compare(password, passwordObj.password))) {
    throw new Error(constant.VALIDATION.CREDENTIAL_NOT_MATCH_MESSAGE);
  }

  return user;
};

UserSchema.statics.checkIsExist = async function ({ email }) {
  const userObj = await this.findOne({ email });
  return !!userObj;
};

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens.push({ token });
  await user.save();
  return token;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
