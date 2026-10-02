const express = require("express");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const ownership = require("../middleware/ownership");
const {
  createArticle,
  updateArticle,
  publishArticle,
  getArticles,
  getArticleById,
  getMyArticles,
  getDrafts,
} = require("../controllers/articleController");

const router = express.Router();

// public
router.get("/", getArticles);

// these two must come BEFORE "/:id", or "my" and "drafts" would be read as an id
router.get("/my", auth, authorizeRoles("author"), getMyArticles);
router.get("/drafts", auth, authorizeRoles("editor"), getDrafts);

router.get("/:id", getArticleById);

// author
router.post("/", auth, authorizeRoles("author"), createArticle);
router.patch("/:id", auth, authorizeRoles("author"), ownership, updateArticle);

// editor
router.patch("/:id/publish", auth, authorizeRoles("editor"), publishArticle);

module.exports = router;