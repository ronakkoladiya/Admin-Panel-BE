const User = require("../../Models/UserSchema");

const convertFieldName = (fieldName) => {
  const convertUpperCase = fieldName.toLowerCase();
  return convertUpperCase.charAt(0).toUpperCase() + convertUpperCase.slice(1);
};

const schemaErrorResponse = ({ error, res }) => {
  const requestBodyError = error.details.reduce((acc, cur) => {
    const fieldName = cur.context.key;
    const errorMessage = cur.message
      .replace(/\"/g, "")
      .replace(/^[a-z]/, (letter) => letter.toUpperCase());
    return { ...acc, [fieldName]: errorMessage };
  }, {});

  res.status(400).send({ requestBodyError });
};

module.exports = {
  schemaErrorResponse,
  convertFieldName,
};
