const express = require("express");
const {
  getAllArticles,
  searchArticles,
  getSingleArticle,
} = require("../controllers/articleController");

const articleRouter = express.Router();

// GET /api/articles/search?q=keyword
articleRouter.get("/search", searchArticles);

// GET /api/articles
articleRouter.get("/", getAllArticles);

// GET /api/articles/:id
articleRouter.get("/:id", getSingleArticle);

module.exports = articleRouter;
