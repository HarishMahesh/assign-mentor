const express = require("express");
const Mentor = require("../models/mentorModel");
const Student = require("../models/studentModel");
const router = express();

router.post("/", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Required input fields missing" });
  }

  let data = await Mentor.find({ email: email });

  if (data.length > 0) {
    return res.status(400).json({ message: "Email Id allready exists" });
  }

  try {
    data = await Mentor.create({
      name: name,
      email: email,
    });

    res.status(200).json({ message: "Mentor create sucessfully", data: data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Internal server error" });
  }
});

router.post("/assign-students/:mentorId", async (req, res) => {
  const mentorId = req.params.mentorId;
  /*
  Input format
  {
    "students" : "[\"61f54473cf143b5b9c4673d7\",\"61f544ebcf143b5b9c4673db\"]"
    } 
*/
  let students = req.body.students; // students id should be given in the form of array in stringgify format
  students = JSON.parse(students); // converting stringify format to json

  if (!students || students.length < 1) {
    return res.status(400).json({ message: "Required input fields missing" });
  }

  try {
    for (let i in students) {
      let data = await Student.findById(students[i]);
      if (data.mentor) {
        return res.status(400).json({
          message: `student ${students[i]} with name ${data.name} was allready assigned with mentor`,
        });
      }
    }

    for (let i in students) {
      let data = await Student.findByIdAndUpdate(
        students[i],
        {
          mentor: mentorId,
        },
        { new: true }
      );
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Internal server error" });
  }

  res
    .status(200)
    .json({ message: "Mentor assigned sucessfully for all students" });
});

router.get("/all-students/:mentorId", async (req, res) => {
  const mentorId = req.params.mentorId;

  try {
    let data = await Student.find({ mentor: mentorId });

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Internal server error" });
  }
});

module.exports = router;
