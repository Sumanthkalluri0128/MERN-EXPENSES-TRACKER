const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../model/User");

//! User registration

const usersController = {
  //Register
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    //!validate
    if (!username || !email || !password) {
      throw new Error("All fields are required");
    }
    //!check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }
    //!has the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //!create the suer nd save to DB
    const userCreated = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    res.json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),
  //Login
  //profile
};
module.exports = usersController;
