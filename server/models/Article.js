const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    articleId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["How-to", "FAQ", "Troubleshooting", "Reference", "Policy"],
      default: "How-to",
    },
    summary: {
      type: String,
      required: true,
    },
    resolution: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "English",
    },
    version: {
      type: String,
      default: "v1.0",
    },
    visibility: {
      type: [String],
      default: ["All Agents"],
    },
    channels: {
      type: [String],
      default: ["Internal App"],
    },
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Review", "Archived"],
      default: "Draft",
    },
    createdBy: {
      type: String,
      required: true,
    },
    lastModifiedBy: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.index({ title: "text", summary: "text", category: "text" });

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
