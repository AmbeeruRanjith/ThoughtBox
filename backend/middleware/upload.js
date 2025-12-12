const multer = require("multer");

const storage = multer.memoryStorage(); // store in memory first
const upload = multer({ storage: storage });

module.exports = upload;
