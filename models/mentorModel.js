const mongoose = require("mongoose");

const mentorModel = mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
});

const Mentor = mongoose.model("Mentor", mentorModel);

module.exports = Mentor;
