const Joi = require("joi");
const constant = require("../constant");

const passwordSchema = Joi.string()
  .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
  .required()
  .trim()
  .messages({
    "string.pattern.base": constant.VALIDATION.PASSWORD_MESSAGE,
  });

const confirmPasswordMatchMessage =
  constant.VALIDATION.CONFIRM_PASSWORD_MESSAGE;

const commonSchema = {
  password: passwordSchema,
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    confirmPasswordMatchMessage,
  }),
};

const signUpBodySchema = Joi.object({
  firstName: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  ...commonSchema,
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/),
  userType: Joi.string().valid("admin", "employee"),
});

const loginBodySchema = Joi.object({
  email: Joi.string().email().required().trim(),
  password: passwordSchema,
});

const forgotPasswordBodySchema = Joi.object({
  email: Joi.string().email().required().trim(),
});

const resetPasswordBodySchema = Joi.object({
  password: passwordSchema,
  ...commonSchema,
});

const branchBodySchema = Joi.object({
  branchName: Joi.string().required().trim(),
  location: Joi.string().required().trim(),
  contact: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  email: Joi.string().email().required().trim(),
  accessories: Joi.array(),
});

const userBaseSchema = {
  firstName: Joi.string().required().trim(),
  middleName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  gender: Joi.string().required().valid("male", "female"),
  userType: Joi.string().required().valid("admin", "employee"),
  phone: Joi.string()
    .required()
    .length(10)
    .pattern(/^[0-9]+$/),
  joinDate: Joi.date().required(),
  profilePicture: Joi.string(),
  dateOfBirth: Joi.date(),
  address: Joi.string().trim(),
};

const addUserBodySchema = Joi.object({
  ...userBaseSchema,
  ...commonSchema,
  branch: Joi.string().required(),
  technology: Joi.string().required(),
  designation: Joi.string().required(),
  dateOfLeaving: Joi.date(),
  currentProject: Joi.string().trim(),
  salary: Joi.string().trim(),
  userRole: Joi.string().required(),
});

const updateUserBodySchema = Joi.object({
  ...userBaseSchema,
  branch: Joi.string().required(),
  technology: Joi.string().required(),
  designation: Joi.string().required(),
  dateOfLeaving: Joi.date(),
  currentProject: Joi.string().trim(),
  salary: Joi.string().trim(),
  userRole: Joi.string().required(),
  password: Joi.string()
    .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    .trim()
    .messages({
      "string.pattern.base": constant.VALIDATION.PASSWORD_MESSAGE,
    }),
  confirmPassword: Joi.any().valid(Joi.ref("password")).messages({
    confirmPasswordMatchMessage,
  }),
});

const projectBodySchema = Joi.object({
  projectName: Joi.string().required().trim(),
  client: Joi.string().required().trim(),
  startDate: Joi.date().required(),
  endDate: Joi.date(),
  status: Joi.string().valid("active", "de-active", "none"),
  technology: Joi.array(),
  teamLeader: Joi.array(),
  teamMembers: Joi.array(),
  description: Joi.string(),
});

const reportProjectBodySchema = Joi.object({
  projectId: Joi.string().required(),
  hours: Joi.number().integer().min(0).required(),
  minutes: Joi.number().integer().min(0).max(59).required(),
  description: Joi.string().required(),
});

const reportBodySchema = Joi.object({
  reportDate: Joi.date().required(),
  employeeId: Joi.string().required(),
  totalTime: Joi.string(),
  project: Joi.array().items(reportProjectBodySchema).min(1).required(),
});

const nameSchema = Joi.object({
  name: Joi.string().required(),
});

const createBankDetailsSchema = Joi.object({
  userId: Joi.string().required(),
  bankName: Joi.string().required(),
  accountNumber: Joi.string().required(),
  ifsc: Joi.string().required(),
  upiNumber: Joi.string().required(),
  passbook: Joi.string(),
});

const leaveBodySchema = Joi.object({
  timeOffLeave: Joi.string().required().valid("fullDay", "halfDay", "shortDay"),
  leaveType: Joi.string()
    .required()
    .valid("casual", "medical", "maternity", "LWOP", "emergency"),
  fromDate: Joi.date().required(),
  toDate: Joi.date().required(),
  reasonDescribe: Joi.string().required(),
  userId: Joi.string().required(),
  status: Joi.string()
});

module.exports = {
  signUpBodySchema,
  loginBodySchema,
  forgotPasswordBodySchema,
  resetPasswordBodySchema,
  branchBodySchema,
  addUserBodySchema,
  updateUserBodySchema,
  projectBodySchema,
  reportBodySchema,
  designationBodySchema: nameSchema,
  technologyBodySchema: nameSchema,
  AccessoriesBodySchema: nameSchema,
  createBankDetailsSchema,
  leaveBodySchema,
};
