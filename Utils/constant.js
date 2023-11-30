let constants = {
  TITLE: {
    FORGOT_PASSWORD_SUBJECT_MESSAGE: "For Password Reset",
  },
  SUCCESS: {
    REGISTER_MESSAGE: "The user has successfully registered.",
    LOGIN_MESSAGE: "The user has successfully logged in.",
    FORGOT_PASSWORD_MESSAGE:
      "Check your inbox for mail and reset your password.",
    RESET_PASSWORD_MESSAGE: "Your password has been successfully updated.",
    DATA_ADD_SUCCESSFULLY_MESSAGE: "The data has been successfully insert!",
    DATA_UPDATE_SUCCESSFULLY_MESSAGE: "The data has been successfully update!",
    DATA_DELETE_SUCCESSFULLY_MESSAGE: "The data has been successfully delete!",
  },
  ERROR: {
    EMAIL_NOT_EXISTS_MESSAGE: "An email address with this name does not exist.",
    EMAIL_EXISTS_MESSAGE: "This email already exists.",
    USER_BANK_DETAILS_EXISTS_MESSAGE: "This user bank details already exists.",
    UNIQUE_FIELD_MESSAGE: "must be unique.",
    NODEMAILER_ERROR_MESSAGE:
      "There is an error on sending the email, you may try later.",
    AUTHENTICATE: "Please Authenticate",
    ACCESS : "Only admin can access this Url"
  },
  VALUES: {
    GENDER_ARRAY: ["male", "female"],
    USER_TYPE_ARRAY: ["admin", "employee"],
    STATUS_ARRAY: ["active", "de-active", "none"],
  },
  VALIDATION: {
    EMAIL_INVALID_MESSAGE: "Email is invalid",
    PASSWORD_MESSAGE:
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character",
    CONFIRM_PASSWORD_MESSAGE: ` "any.only": "{{#label}} does not match."`,
    CONTACT_MESSAGE: "Only numbers should be entered",
    CREDENTIAL_NOT_MATCH_MESSAGE: "The credentials do not match",
    INVALID_TOKEN_MESSAGE: "This token is not valid.",
    PASSWORD_NOT_MATCH_MESSAGE:
      "You can generate a new password using the forgot password option.",
    INVALID_FILE_MESSAGE:
      "Invalid file format. Only CSV and Excel files are supported.",
    NOT_FOUND_FILE: "File not provided.",
    REPORT_ALREADY_EXISTS:
      "For this report date, you have already submitted your project report",
    EMPLOYEE_REPORT_NOT_FOUND: "Report not found for the specified employee.",
    REPORT_PROJECT_NOT_FOUND: "Project not found within the specified report.",
    PASS_EMPLOYEE_ID_PARAMS: "Pass employeeId as a parameter in the URL.",
    PROJECT_NOT_FOUND_SPECIFIED_DATE:
      "Project not found within the specified date range.",
  },
};

module.exports = Object.freeze(constants);
