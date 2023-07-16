const router = require('express').Router()
const auth = require("../middlewares/authMiddleware")
const user = require('../controller/userController')
const validateObjectId = require('../middlewares/validateObjectId')

router.route('/')
    .get(auth.authorizeAdminAndManager, user.getAllUsers)
    .post(auth.authorizeAdminAndManager, user.createUser)
router.route('/:id')
    .get(validateObjectId, user.getUserById)
    .put(validateObjectId, user.updateUser)
    .delete(validateObjectId,auth.authenticate, user.deleteUser)

module.exports = router