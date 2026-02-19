const router = require("express").Router();

const authorRoutes = require("./author");
const categoryRoutes = require("./category");

router.use("/authors", authorRoutes);
router.use("/categories", categoryRoutes);

module.exports = router;
