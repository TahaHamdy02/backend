const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const noteSchema = new mongoose.Schema({
  ticketNumber: {
    type: Number,
    unique: true,
    default: 0
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'COMPLETED'],
    default: 'OPEN'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

noteSchema.plugin(AutoIncrement, {
  inc_field: 'ticketNumber',
  start_seq: 500
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
