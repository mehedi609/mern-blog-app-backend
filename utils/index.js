const generateToken = require('./generateToken');
const { EMAIL_TEMPLATE_NAME, sendEmail } = require('./send-email');

module.exports = { generateToken, sendEmail, EMAIL_TEMPLATE_NAME };
