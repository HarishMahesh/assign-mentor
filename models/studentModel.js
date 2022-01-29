let mongoose = require("mongoose");

const studentModel = mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  batch: { type: String },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
});

const Student = mongoose.model("Student", studentModel);

module.exports = Student;
