const mongoose = require("mongoose");
const Article = require("../models/Article");

const ownership = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid article id" });
    }

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only edit your own articles" });
    }

    if (article.status !== "draft") {
      return res
        .status(403)
        .json({ message: "Published articles cannot be edited" });
    }

    req.article = article; // the controller reuses it
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = ownership;