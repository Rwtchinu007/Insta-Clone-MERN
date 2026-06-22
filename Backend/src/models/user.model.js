const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username already exists"],
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    unique: [true, "email already exists"],
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    select: false, // Exclude password field from query results by default
  },
  bio: String,
  profileImage: {
    type: String,
    default:
      "https://ik.imagekit.io/rwt007/74a3b6a8856b004dfff824ae9668fe9b.jpg?updatedAt=1776505233078",
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
