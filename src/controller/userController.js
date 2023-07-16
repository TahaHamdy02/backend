const User = require("../model/User");
const asyncHandler = require("express-async-handler")
const validation = require('../validation/validation')

exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().lean()
    if (!users) {
        return res.status(400).json({ message: 'No users found' });
    }
    res.status(200).json(users)
})

exports.createUser = asyncHandler(async (req, res) => {
    const { email, username } = req.body
    const { error } = validation.newUser(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        if (existingUser._id.toString() !== id) {
            return res.status(409).json({ message: 'Username or email already in use' });
        }
    }
    const user = new User({ ...req.body });
    try {
        await user.save();
        res.status(201).json({ message: "user created successfully", user });
    } catch (error) {
        console.error(error.message)
        res.status(400).json({ message: "cant create user right now please try agin later" })
    }
})

exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).lean().exec();
    if (!user) {
        return res.status(404).json({ message: 'user not found' });
    }
    res.status(200).json(user)
}
)

exports.updateUser = async (req, res) => {
    const { id } = req.params
    const { username, email, role, password } = req.body
    const { error } = validation.updateUser(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        if (existingUser._id.toString() !== id) {
            return res.status(409).json({ message: 'Username or email already in use' });
        }
    }
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    user.username = username
    user.roles = role
    if (password) {
        user.password = password;
    }

    await user.save();
    res.status(200).json(user);
};

exports.deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {


        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { role } = req.user;

        if (role.includes(['Admin'])) {
            if (user.role.includes(['Admin']) || user.role.includes(['Manager'])) {
                return res.status(403).json({ message: 'Admins cannot delete other admins or managers' });
            }
        } else if (role.includes(['Manager']) && (user.role.includes(['Admin']) || user.role.includes(['Employee']))) {
            const openNotes = await Note.find({ assignedTo: id, status: 'OPEN' });
            if (openNotes.length > 0) {
                return res.status(400).json({ message: 'Cannot delete user with open notes' });
            }
        }
        await User.findByIdAndRemove(id);
        res.status(200).json({ message: 'User successfully deleted' });
    } catch (error) {
        console.error(error.message)
    }
});
