// API ka logic controller file k andr bnta h

const userModel = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

async function loginController(req, res) {
  const { username, email, password } = req.body;
  // login with username or password
  // OR
  // login with username or email
  const user = await userModel.findOne({
    $or: [
      {
        // condition 1 ayegi
        username: username,
      },
      {
        // condition 2 ayegi
        email: email,
      },
    ],
  });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  const isPasswordValid = hash == user.password;
  if (!isPasswordValid) {
    res.status(401).json({
      message: "Invalid password",
    });
  }
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);
  res.status(200).json({
    message: "User logged in successfully",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

async function registerController(req, res) {
  const { email, username, password, bio, profileImage } = req.body;
  //   const isUserExistByEmail = await userModel.findOne({ email });
  //   if (isUserExistByEmail) {
  //     return res.status(409).json({
  //       message: "User already exists with the same email",
  //     });
  //   }
  //   const isUserExistByUsername = await userModel.findOne({ username });
  //   if (isUserExistByUsername) {
  //     return res.status(409).json({
  //       message: "Username already exists",
  //     });
  //   }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (isUserAlreadyExists) {
    return res.status(409).json({
      message:
        isUserAlreadyExists.email == email
          ? "email already exists"
          : "username already exists",
    });
  }
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  const user = await userModel.create({
    username,
    email,
    bio,
    profileImage,
    password: hash,
  });

  // user data should be unique
  const token = await jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);
  res.status(201).json({
    message: "User registered successfully",
    user: {
      email: user.email,
      id: user._id,
      username: user.username,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

module.exports = {
    registerController,
    loginController
}