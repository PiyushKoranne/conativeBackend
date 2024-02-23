var express = require("express");
var router = express.Router();
var multer = require("multer");
var path = require("path");

var imagec = "";
const date = new Date();

const frontend_url = "https://conativeitsolutions.com/assets/imgupload/";

router.use("/imgupload", express.static(__dirname + "/imgupload"));

const storage = multer.diskStorage({
  	destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../../conativeitsolutions.com/public_html/assets/imgupload"));
  },
  filename: function (req, file, cb) {
    var month = date.getMonth() + 1;
    let year = date.getFullYear();

    const uniqueSuffix = year + "-" + month + "_";
    cb(null, uniqueSuffix + file.originalname);
  },
});

var upload = multer({ storage: storage });

router.use((error, req, res, next) => {
  const message = `This is the unexpected field -> "${error.field}"`;
  return res.status(500).send(message);
});

const url =
  "mongodb://localhost:27017";

module.exports = { upload, url, frontend_url };
