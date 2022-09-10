const jwt = require('jsonwebtoken');

const generateToken = (id, expiresIn) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn,
  });
};

module.exports = generateToken;
