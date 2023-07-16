const Joi = require("joi")
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const messages = {
  username: {
    "string.min": "username must be at least 2 characters",
    "string.max": "username must be less than or equal to 30 characters",
    "any.required": "username is required",
  },
  password: {
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must be less than or equal to 32 characters",
    "string.pattern.base":
      "Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character.",
    "any.required": "Password is required",
  },
  email: {
    "string.min": "Email must be at least 5 characters long",
    "string.max": "Email must be less than or equal to 100 characters",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  },
}
function createNote(obj) {
  const schema = Joi.object({
    // ticketNumber: Joi.number().integer().required(),
    title: Joi.string().required(),
    body: Joi.string().required(),
    createdBy: Joi.string().required(),
    updatedBy: Joi.string().required(),
    status: Joi.string().valid('OPEN', 'COMPLETED').required(),
    assignedTo: Joi.string().required(),
  })
  return schema.validate(obj);
}
function updateNote(obj) {
  const schema = Joi.object({
    title: Joi.string(),
    body: Joi.string(),
    updatedBy: Joi.string(),
    status: Joi.string().valid('OPEN', 'COMPLETED'),
    assignedTo: Joi.string(),
  })
  return schema.validate(obj);
}
function registerUser(obj) {
  const schema = Joi.object({
    username: Joi.string().trim().min(2).max(30).required().messages(messages.username),
    password: Joi.string().trim().min(8).max(32).pattern(passwordRegex).required().messages(messages.password),
    email: Joi.string().trim().min(5).max(100).required().email().messages(messages.email),
    roles: Joi.array().items(Joi.string().valid('Employee', 'Manager', 'Admin')),
  })
  return schema.validate(obj);
}
function LoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email().messages(messages.email)
  })
  return schema.validate(obj);
}
function newUser(obj) {

  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email().messages(messages.email),
    username: Joi.string().trim().min(2).max(30).required().messages(messages.username),
    password: Joi.string().trim().min(8).max(32).pattern(passwordRegex).required().messages(messages.password),
    role: Joi.array().items(Joi.string().valid('Employee', 'Manager', 'Admin')).required(),
  })
  return schema.validate(obj);
}
function updateUser(obj) {

  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).email().messages(messages.email),
    username: Joi.string().trim().min(2).max(30).messages(messages.username),
    password: Joi.string().trim().min(8).max(32).pattern(passwordRegex).messages(messages.password),
    role: Joi.array().items(Joi.string().valid('Employee', 'Manager', 'Admin')),
  })
  return schema.validate(obj);
}

module.exports = {
  createNote, updateNote, newUser, registerUser, LoginUser,updateUser
}