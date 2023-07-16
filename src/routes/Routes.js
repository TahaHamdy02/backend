const router = require("express").Router();
router.get("/", (req, res) => {
  res.render("welcome");
});

router.use("/auth", require("./authRoutes"));
router.use("/user", require("./userRoutes"));
router.use("/note", require("./noteRoutes"));

router.use((req, res) => {
  res.status(404);
  // console.log(req.headers);
  const accept = req.headers.accept || "";
  if (accept.includes("html")) {
    res.render("404");
  } else if (accept.includes("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

module.exports = router;
