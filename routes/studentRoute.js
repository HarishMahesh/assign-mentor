const express = require("express");
const Mentor = require("../models/mentorModel");
const router = express();
const Student = require("../models/studentModel");

router.post("/", async (req, res) => {
  const { name, email, batch } = req.body;

  if (!name || !email || !batch) {
    return res.status(400).json({ message: "Required input fields missing" });
  }

  let data = await Student.find({ email: email });

  if (data.length > 0) {
    return res.status(400).json({ message: "Email Id allready exists" });
  }

  try {
    data = await Student.create({
      name: name,
      email: email,
      batch: batch,
    });

    res
      .status(200)
      .json({ message: "Student created sucessfully", data: data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Internal server error" });
  }
});

router.put("/change-mentor/:studId", async (req, res) => {
  const studId = req.params.studId;
  const mentorId = req.body.mentorId;

  if (!mentorId) {
    return res
      .status(400)
      .json({ message: "Required fileds are not available" });
  }

  try {
    let data = await Mentor.findById(mentorId);

    if (!data) {
      return res.status(400).json({ message: "Invalid Mentor" });
    }

    let stud = await Student.findByIdAndUpdate(
      studId,
      { mentor: mentorId },
      { new: true }
    ).populate("mentor");

    if (stud) {
      res.status(200).json({ message: "Updation sucessfull", value: stud });
    } else {
      res.status(400).json({ message: "Invalid student Id" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Internal server error" });
  }
});

module.exports = router;
