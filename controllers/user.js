const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { Timestamp } = require("mongodb");
require("dotenv").config();

//Verify if there is already a same email registed
exports.isAuser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(200).json({ message: "Email available!" });
    }

    return res.status(205).json({ message: "User exists!" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.signup = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.RANDOM_TOKEN_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return res.status(201).json({
      user: user.email,
      userId: user._id,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.signin = async (req, res, next) => {
  //fetch user from DB
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    console.log("No Users");
    return res.status(401).json({ error: "User not found!" });
  }

  // Load hash from DB and compare.
  const valid = await bcrypt.compare(req.body.password, user.password);

  if (!valid) {
    console.log("Password wrong");
    return res.status(401).json({ error: "Password is not correct !" });
  }

  // Sign in the user and return the token
  const token = await jwt.sign(
    { userId: user._id },
    process.env.RANDOM_TOKEN_SECRET,
    { expiresIn: "24h" }
  );
  res.status(200).json({
    userId: user._id,
    user: user.email,
    token: token,
  });
};
