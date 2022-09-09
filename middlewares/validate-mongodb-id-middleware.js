const mongoose = require('mongoose');
const { CastError } = require('../errors');

const validateMongodbId = (req, res, next) => {
  if (req.params.id) {
    const isValid = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isValid)
      return next(new CastError(`${req.params.id} is not a valid Mongodb ID`));
  }
  next();
};

module.exports = validateMongodbId;
