const path = require("path");
const multer = require("multer");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Please upload only images." }, false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadImageMiddleware = multer({
  storage: storage,
  fileFilter: imageFilter,
});

module.exports = {
  uploadImageMiddleware,
  storage: storage,
};
