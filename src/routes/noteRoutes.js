const router = require('express').Router()
const auth = require("../middlewares/authMiddleware")
const note = require('../controller/noteController')
const validateObjectId = require('../middlewares/validateObjectId')

router.route('/')
    .get(auth.authorizeAdminAndManager, note.getAllNotes)
    .post(auth.authorizeAdminAndManager, note.createNote)
router.route('/:id')
    .get(validateObjectId, note.getNoteById)
    .put(validateObjectId, auth.authorizeAdminAndManager, note.updateNote)
    .delete(validateObjectId, auth.authorizeAdminAndManager, note.deleteNote)

module.exports = router