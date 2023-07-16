const Token = require("../model/Token");
const User = require("../model/User");
const validation = require("../validation/validation");
const asyncHandler = require("express-async-handler")
exports.registerUserCtrl = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { error } = validation.registerUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "User already exists" });
  }
  const newUser = new User(req.body);
  await newUser.save();

  res.status(201).json({ message: "You have registered successfully. Please log in." });
});



exports.loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { error } = validation.LoginUser({ email });
  if (error) {
    console.log(error);
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const haveToken = await Token.findOne({ userId: user._id })

  if (haveToken) {
    await Token.deleteOne({ userId: user._id });
  }
  const token = user.generateAuthToken()
  const newToken = new Token({ userId: user._id, token })
  await newToken.save()

  res.cookie('token', token, { httpOnly: true, secure: true });
  res.status(200).json({ message: "Login successful" });
});
