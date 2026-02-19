const router = require("express").Router();

const authorController = require("../controllers/author");
const validate = require("../middlewares/validate");
const { createAuthorSchema, updateAuthorSchema } = require("../validations/author");

router.get("/", authorController.getAllAuthors);
router.get("/:id", authorController.getAuthorById);

router.post("/", validate(createAuthorSchema), authorController.createAuthor);

router.patch("/:id", validate(updateAuthorSchema), authorController.updateAuthor);

router.delete("/:id", authorController.deleteAuthor);

module.exports = router;
