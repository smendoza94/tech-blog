const router = require("express").Router();
const apiRouter = require("./api");

router.use("/api", apiRouter);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
