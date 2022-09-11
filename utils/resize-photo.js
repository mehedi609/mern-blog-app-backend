const sharp = require('sharp');
const path = require('path');

const resizePhoto = (file, filePath) => {
  file.filename = `user-${Date.now()}-${file.originalname}`;

  return sharp(file.buffer)
    .resize(250, 250)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(`${filePath}`, `${file.filename}`));
};

module.exports = resizePhoto;
