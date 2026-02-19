const mongoose = require("mongoose");
const Author = require("../models/author");

exports.getAllAuthors = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Author.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Author.countDocuments(),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAuthorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid author id" });
    }

    const author = await Author.findById(id);
    if (!author) return res.status(404).json({ message: "Author not found" });

    res.json(author);
  } catch (err) {
    next(err);
  }
};

exports.createAuthor = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const author = await Author.create({ name, bio });
    res.status(201).json(author);
  } catch (err) {
    next(err);
  }
};

exports.updateAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid author id" });
    }

    const updated = await Author.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      omitUndefined: true,
    });

    if (!updated) return res.status(404).json({ message: "Author not found" });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid author id" });
    }

    const deleted = await Author.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Author not found" });

    res.json({ message: "Author deleted successfully" });
  } catch (err) {
    next(err);
  }
};
