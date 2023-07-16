const Note = require("../model/Note");
const User = require("../model/User");
const validation = require("../validation/validation");
const asyncHandler =require("express-async-handler")
exports.getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean();
  if (!notes) {
    return res.status(400).json({ message: 'No notes found' });
  }
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.createdBy).lean().exec();
      return { ...note, createdBy: { userId: user._id, username: user.username } };
    })
  );

  res.status(200).json(notesWithUser);
});

exports.createNote = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { error } = validation.createNote(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }
  const existingNote = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()
  if (existingNote) {
    return res.status(409).json({ message: "Note with the same title already exists" })
  }
  const note = new Note({ ...req.body });
  try {
    await note.save();
    res.status(201).json({ message: "Note created successfully", note });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
)

exports.getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id).lean().exec();
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  res.status(200).json(note)
}
)

exports.updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user.id
  const { error } = validation.updateNote(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }
  const note = await Note.findByIdAndUpdate(
    id, {
    $set: {
      ...req.body,
      updatedBy: userId
    }
  },
    { new: true }
  ).lean().exec();

  if (!note) {
    res.status(404).json({ message: 'Note not found' });
  } else {
    res.json(note);
  }
})

exports.deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params
  const note = await Note.findByIdAndDelete(id).lean().exec();
  if (!note) {
    res.status(404).json({ error: 'Note not found' });
  } else {
    res.status(204).json({ message: "Note successfully deleted" })
  }
}
) 