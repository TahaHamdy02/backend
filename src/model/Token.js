const mongoose = require("mongoose")
const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }, token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d',
    },
})
const Token = mongoose.model('Token', tokenSchema);

module.exports = Token; 