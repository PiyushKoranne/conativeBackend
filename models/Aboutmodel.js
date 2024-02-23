const mongoose = require("mongoose");
// const {Schema} = mongoose;

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

const aboutmodel = mongoose.model("about", aboutSchema);

module.exports = aboutmodel;
