const mongoose = require("mongoose");
// const {Schema} = mongoose;

const spSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  our_work_tagline: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    required: true,
  },
  btnname: {
    type: String,
    required: true,
  },
  our_work_url: {
    type: String,
    required: true,
  },
  image: {
    type: Array,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

const Spmodel = mongoose.model("startproject", spSchema);

module.exports = Spmodel;
