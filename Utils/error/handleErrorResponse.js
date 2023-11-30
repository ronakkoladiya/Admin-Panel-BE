const handleErrorResponse = (res, err) => {
  res.status(400).send({ error: err.message });
};

module.exports = handleErrorResponse;
