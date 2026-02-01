const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const connectDB = async () => {
  try {
  } catch (err) {
    console.error("ATLAS Connecntion failed", err);
    process.exit(1);
  }
};

connectDB();

const loginShcema = new mongoose.Schema({
  user: String,
  pass: String,
});

const loginModel = mongoose.model("logins", loginShcema, "userlogins");

app.post("/register", async (req, res) => {
  try {
    const { user, pass } = req.body;
    const existedUser = await loginModel.findOne({ user });
    if (existedUser) {
      return res.status(400).send("user already existed");
    }

    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = new loginModel({
      user,
      pass: hashedPassword,
    });
    await newUser.save();
    res.redirect("/login.html");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering Student");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { user, pass } = req.body;
    const dbUser = await loginModel.findOne({ user });
    if (!userOne) {
      return res.status(404).send("user not found");
    }

    const isMatch = await bcrypt.compare(pass, dbUser.pass);
    if (isMatch) {
      res.send(`<h1>Login Successfull! Welcome ${dbUser.user}</h1>`);
    } else {
      res.status(401).send("Invalid Credintails");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Intrnal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server Running at http://localhost:3000");
});
