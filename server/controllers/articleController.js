const Article = require("../models/Article");

// GET /api/articles - Fetch all articles with optional pagination
const getAllArticles = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, category, type } = req.query;

    const filterQuery = {};
    if (status) filterQuery.status = status;
    if (category) filterQuery.category = category;
    if (type) filterQuery.type = type;

    const articleSkipCount = (parseInt(page) - 1) * parseInt(limit);

    const [articleList, totalArticleCount] = await Promise.all([
      Article.find(filterQuery)
        .sort({ createdAt: -1 })
        .skip(articleSkipCount)
        .limit(parseInt(limit)),
      Article.countDocuments(filterQuery),
    ]);

    res.status(200).json({
      success: true,
      data: articleList,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalArticleCount / parseInt(limit)),
        totalArticles: totalArticleCount,
        articlesPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch articles from database",
      error: error.message,
    });
  }
};

// GET /api/articles/search?q=keyword - Search articles
const searchArticles = async (req, res) => {
  try {
    const { q = "", page = 1, limit = 50 } = req.query;

    if (!q.trim()) {
      return getAllArticles(req, res);
    }

    const searchRegex = new RegExp(q.trim(), "i");

    const searchQuery = {
      $or: [
        { title: searchRegex },
        { category: searchRegex },
        { summary: searchRegex },
        { type: searchRegex },
        { articleId: searchRegex },
        { createdBy: searchRegex },
      ],
    };

    const articleSkipCount = (parseInt(page) - 1) * parseInt(limit);

    const [searchResults, totalSearchCount] = await Promise.all([
      Article.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(articleSkipCount)
        .limit(parseInt(limit)),
      Article.countDocuments(searchQuery),
    ]);

    res.status(200).json({
      success: true,
      data: searchResults,
      searchQuery: q,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalSearchCount / parseInt(limit)),
        totalArticles: totalSearchCount,
        articlesPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search articles",
      error: error.message,
    });
  }
};

// GET /api/articles/:id - Get single article by ID
// Pass ?preview=true to skip view count increment (used by hover previews)
const getSingleArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const isPreview = req.query.preview === "true";

    const foundArticle = await Article.findOne({
      $or: [{ _id: id }, { articleId: id }],
    });

    if (!foundArticle) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // Only increment view count for real page views, not hover previews
    if (!isPreview) {
      foundArticle.views += 1;
      await foundArticle.save();
    }

    res.status(200).json({
      success: true,
      data: foundArticle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch article",
      error: error.message,
    });
  }
};

module.exports = {
  getAllArticles,
  searchArticles,
  getSingleArticle,
};
