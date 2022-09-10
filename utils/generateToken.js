const jwt = require('jsonwebtoken');

const generateToken = (id, expiresIn = null) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: `${process.env.EXPIRES_IN}`,
  });
};

module.exports = generateToken;
