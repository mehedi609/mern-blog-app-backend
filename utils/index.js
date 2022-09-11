const generateToken = require('./generateToken');
const { EMAIL_TEMPLATE_NAME, sendEmail } = require('./send-email');
const uploadImgToCloudinary = require('./upload-img-to-cloudinary');
const resizePhoto = require('./resize-photo');
const { hasChosen } = require('./like-dislike-post');

module.exports = {
  generateToken,
  sendEmail,
  EMAIL_TEMPLATE_NAME,
  uploadImgToCloudinary,
  resizePhoto,
  hasChosen,
};
