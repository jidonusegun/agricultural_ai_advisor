const express = require("express");
const multer = require("multer");
const { diagnoseCrop } = require("../controllers/diagnose.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), diagnoseCrop);

module.exports = router;