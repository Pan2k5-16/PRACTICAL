const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error)
    });

// let students = [
//     {
//         id: 1,
//         name: "John Doe",
//         course: "BSIT",
//         age: 20
//     },
//     {
//         id: 2,
//         name: "Maria Hiwaga",
//         course: "BSCS",
//         age: 30
//     }
// ];

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.get("/students", async (req, res) => {
    const students = await Student.find();
    
    res.json(students);
});


app.post("/students", async (req, res) => {
    try {
        const newStudent = new Student({
            name: req.body.name,
            course: req.body.course,
            age: req.body.age
        });

        const savedStudent = await newStudent.save();

        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(500).json({
            message: "Error adding student",
            error: error.message
        });
    }
});


app.delete("/students/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!deletedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully",
            student: deletedStudent
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting student",
            error: error.message
        });
    }
});


app.put("/students/:id", async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                course: req.body.course,
                age: req.body.age
            },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({
            message: "Error updating student",
            error: error.message
        });
    }
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});