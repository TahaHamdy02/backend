const router = require("express").Router();
const auth = require("../controller/authController");
router.post("/register", auth.registerUserCtrl);
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", auth.loginUserCtrl);
module.exports = router;
