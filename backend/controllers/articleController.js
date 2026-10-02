const mongoose = require("mongoose");
const Article = require("../models/Article");

// escape user input so it is treated as plain text inside a regex
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// POST /articles (author)
const createArticle = async (req, res) => {
  try {
    const { title, content, category } = req.body || {};

    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ message: "Title, content and category are required" });
    }

    const article = await Article.create({
      title,
      content,
      category,
      author: req.user.id, // taken from the token, never from the body
      status: "draft",
    });

    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH /articles/:id (owner, draft only; checked in ownership middleware)
const updateArticle = async (req, res) => {
  try {
    const { title, content, category } = req.body || {};
    const article = req.article;

    if (title !== undefined) article.title = title;
    if (content !== undefined) article.content = content;
    if (category !== undefined) article.category = category;

    await article.save();
    res.json(article);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH /articles/:id/publish (editor only)
const publishArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid article id" });
    }

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.status === "published") {
      return res.status(400).json({ message: "Article is already published" });
    }

    article.status = "published";
    article.publishedAt = new Date();
    await article.save();

    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /articles?category=&search= (public, published only)
const getArticles = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { status: "published" };

    if (category && typeof category === "string") {
      filter.category = new RegExp(`^${escapeRegex(category.trim())}$`, "i");
    }

    if (search && typeof search === "string") {
      const regex = new RegExp(escapeRegex(search.trim()), "i");
      filter.$or = [{ title: regex }, { content: regex }];
    }

    const articles = await Article.find(filter)
      .populate("author", "name")
      .sort({ publishedAt: -1 });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /articles/:id (public, published only)
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid article id" });
    }

    const article = await Article.findOne({
      _id: id,
      status: "published",
    }).populate("author", "name");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /articles/my (author: their own drafts and published articles)
const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user.id }).sort({
      updatedAt: -1,
    });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /articles/drafts (editor: drafts waiting to be published)
const getDrafts = async (req, res) => {
  try {
    const drafts = await Article.find({ status: "draft" })
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createArticle,
  updateArticle,
  publishArticle,
  getArticles,
  getArticleById,
  getMyArticles,
  getDrafts,
};
