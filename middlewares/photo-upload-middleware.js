const multer = require('multer');

//storage
const multerStorage = multer.memoryStorage();

//file type checking
const multerFilter = (req, file, cb) => {
  //check file type
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    //rejected files
    cb(
      {
        message: 'Unsupported file format',
      },
      false,
    );
  }
};

const photoUploadMiddleware = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 4000000 },
});

module.exports = { photoUploadMiddleware };
