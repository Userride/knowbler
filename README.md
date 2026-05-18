# 📚 Knowbler — Knowledge Base Dashboard

> A full-stack knowledge base management dashboard built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend). Features real-time search, infinite scroll, and article hover previews.

---

## 📋 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [Backend — Server](#backend--server)
   - [Entry Point](#entry-point-serverindexjs)
   - [Environment Variables](#environment-variables-serverenv)
   - [MongoDB Model](#mongodb-model-servermodelsarticlejs)
   - [Routes](#routes-serverroutesarticleroutesjs)
   - [Controller](#controller-servercontrollersarticlecontrollerjs)
   - [Seed Script](#seed-script-serverseedjs)
5. [Frontend — Client](#frontend--client)
   - [Entry Point](#entry-point-clientsrcmainjsx)
   - [App Router](#app-router-clientsrcappjsx)
   - [Global Styles & CSS Variables](#global-styles-clientsrcindexcss)
   - [Services Layer](#services-layer-clientsrcservicesarticleservicejs)
   - [Pages](#pages)
   - [Components](#components)
6. [Hover Preview Feature](#hover-preview-feature)
7. [API Reference](#api-reference)
8. [Running the Project](#running-the-project)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 4, React Router v7 |
| Styling | Vanilla CSS with CSS custom properties |
| HTTP Client | Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB via Mongoose 7 |
| Dev Font | Inter (Google Fonts) |

---

## Project Structure

```
knowbler/
├── client/                        # React + Vite frontend
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx               # React DOM entry point
│       ├── App.jsx                # Root router
│       ├── index.css              # Global CSS variables & reset
│       ├── services/
│       │   └── articleService.js  # Axios API calls
│       ├── pages/
│       │   └── ArticleDashboardPage/
│       │       ├── ArticleDashboardPage.jsx
│       │       └── ArticleDashboardPage.css
│       └── components/
│           ├── Header/            # Top navigation bar
│           ├── NavigationSidebar/ # Left slide-in sidebar
│           ├── ArticleList/       # Infinite-scroll article list
│           ├── ArticleListItem/   # Single article row
│           ├── ArticlePreviewCard/# Hover popup card
│           └── StatusBadge/       # Reusable status pill
│
└── server/                        # Node.js + Express backend
    ├── index.js                   # Express app + MongoDB connect
    ├── .env                       # Environment config
    ├── seed.js                    # 100 dummy article seeder
    ├── models/
    │   └── Article.js             # Mongoose schema
    ├── routes/
    │   └── articleRoutes.js       # Route declarations
    └── controllers/
        └── articleController.js   # Request handlers
```

---

## Architecture Overview

```
Browser (localhost:5173)
       │
       │  React App (Vite)
       │
       ├─ App.jsx ──► ArticleDashboardPage
       │                    │
       │         ┌──────────┼──────────────┐
       │       Header   Sidebar       ArticleList
       │                                   │
       │                           ArticleListItem (×N)
       │                                   │ hover on title
       │                           ArticlePreviewCard
       │                                   │
       │                           fetchSingleArticle()
       │                                   │
       └──────────── HTTP (Axios) ──────────┘
                            │
              Express Server (localhost:5000)
                            │
              /api/articles  ──► articleController
                            │
                        MongoDB
                   (knowbler database)
```

---

## Backend — Server

### Entry Point: `server/index.js`

Bootstraps Express, configures middleware, registers routes, and connects to MongoDB before starting the server.

```js
require("dotenv").config();
const express   = require("express");
const mongoose  = require("mongoose");
const cors      = require("cors");
const articleRoutes = require("./routes/articleRoutes");

const expressApp  = express();
const SERVER_PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────
expressApp.use(cors({ origin: "http://localhost:5173", credentials: true }));
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────
expressApp.use("/api/articles", articleRoutes);

// ── Health check ──────────────────────────────────────
expressApp.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Knowbler API is running" });
});

// ── MongoDB → start server ────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    expressApp.listen(SERVER_PORT, () => {
      console.log(`Knowbler server running on port ${SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
```

---

### Environment Variables: `server/.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/knowbler
```

> ⚠️ Never commit `.env` to version control. Use `.env.example` as a template.

---

### MongoDB Model: `server/models/Article.js`

Defines the Mongoose schema for every article document stored in MongoDB.

```js
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title:          { type: String, required: true, trim: true },
    articleId:      { type: String, required: true, unique: true, trim: true },
    category:       { type: String, required: true, trim: true },
    type:           { type: String, enum: ["How-to","FAQ","Troubleshooting","Reference","Policy"], default: "How-to" },
    summary:        { type: String, required: true },
    resolution:     { type: String, default: "" },
    language:       { type: String, default: "English" },
    version:        { type: String, default: "v1.0" },
    visibility:     { type: [String], default: ["All Agents"] },
    channels:       { type: [String], default: ["Internal App"] },
    views:          { type: Number, default: 0 },
    status:         { type: String, enum: ["Draft","Published","Review","Archived"], default: "Draft" },
    createdBy:      { type: String, required: true },
    lastModifiedBy: { type: String, default: "" },
  },
  { timestamps: true }  // auto-adds createdAt + updatedAt
);

// Full-text search index on title, summary, and category
articleSchema.index({ title: "text", summary: "text", category: "text" });

module.exports = mongoose.model("Article", articleSchema);
```

**Field Reference:**

| Field | Type | Description |
|---|---|---|
| `title` | String | Article heading |
| `articleId` | String | Unique ID like `0000300001` |
| `category` | String | Topic area (General, Billing, Security…) |
| `type` | Enum | How-to / FAQ / Troubleshooting / Reference / Policy |
| `summary` | String | One-paragraph abstract |
| `resolution` | String | Step-by-step fix/instructions |
| `language` | String | Language of the article |
| `version` | String | e.g. `v1.0`, `v2.1` |
| `visibility` | [String] | Who can see it (All Agents, Admins Only…) |
| `channels` | [String] | Where it's published (Internal App, Customer…) |
| `views` | Number | Page view counter |
| `status` | Enum | Draft / Published / Review / Archived |
| `createdBy` | String | Agent name |
| `lastModifiedBy` | String | Last editor's name |
| `createdAt` | Date | Auto by Mongoose |
| `updatedAt` | Date | Auto by Mongoose |

---

### Routes: `server/routes/articleRoutes.js`

Maps HTTP endpoints to controller functions.

```js
const express = require("express");
const { getAllArticles, searchArticles, getSingleArticle } = require("../controllers/articleController");

const articleRouter = express.Router();

articleRouter.get("/search", searchArticles);  // GET /api/articles/search?q=keyword
articleRouter.get("/",       getAllArticles);   // GET /api/articles
articleRouter.get("/:id",    getSingleArticle); // GET /api/articles/:id

module.exports = articleRouter;
```

> **Note:** `/search` must be declared **before** `/:id` so Express doesn't treat the string `"search"` as a dynamic `:id` parameter.

---

### Controller: `server/controllers/articleController.js`

Contains all the business logic for article operations.

#### `getAllArticles` — paginated list

```js
const getAllArticles = async (req, res) => {
  const { page = 1, limit = 50, status, category, type } = req.query;

  const filterQuery = {};
  if (status)   filterQuery.status   = status;
  if (category) filterQuery.category = category;
  if (type)     filterQuery.type     = type;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [articles, total] = await Promise.all([
    Article.find(filterQuery).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Article.countDocuments(filterQuery),
  ]);

  res.json({
    success: true,
    data: articles,
    pagination: { currentPage: +page, totalPages: Math.ceil(total / limit), totalArticles: total }
  });
};
```

#### `searchArticles` — keyword search

```js
const searchArticles = async (req, res) => {
  const { q = "", page = 1, limit = 50 } = req.query;

  if (!q.trim()) return getAllArticles(req, res); // fall back to full list

  const regex = new RegExp(q.trim(), "i"); // case-insensitive
  const query = {
    $or: [
      { title: regex }, { category: regex }, { summary: regex },
      { type: regex },  { articleId: regex }, { createdBy: regex },
    ],
  };

  // ... same pagination pattern as getAllArticles
};
```

#### `getSingleArticle` — fetch by ID

```js
// GET /api/articles/:id?preview=true
const getSingleArticle = async (req, res) => {
  const { id } = req.params;
  const isPreview = req.query.preview === "true"; // hover preview flag

  const article = await Article.findOne({
    $or: [{ _id: id }, { articleId: id }], // accepts both MongoDB _id and articleId
  });

  // Only increment views for real page visits, NOT hover previews
  if (!isPreview) {
    article.views += 1;
    await article.save();
  }

  res.json({ success: true, data: article });
};
```

> **`?preview=true`** — When the hover card fetches details, it passes this flag so view counts are not falsely inflated.

---

### Seed Script: `server/seed.js`

Populates the database with **100 realistic articles** for development/testing.

```js
// Run with: npm run seed
async function seedDatabase() {
  await mongoose.connect(process.env.MONGO_URI);
  await Article.deleteMany({});           // wipe existing data
  await Article.insertMany(dummyArticles); // insert 100 articles
  await mongoose.disconnect();
}
```

Each seeded article gets:
- A title from a pool of 100 real-world knowledge-base topics
- Random `status`, `type`, `category`, `visibility`, `channels`, `version`
- Random `createdAt` (between Oct 2025 – Feb 2026) and `updatedAt`
- A realistic `resolution` built from the summary template

---

## Frontend — Client

### Entry Point: `client/src/main.jsx`

```jsx
import React    from "react";
import ReactDOM from "react-dom/client";
import App      from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### App Router: `client/src/App.jsx`

```jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ArticleDashboardPage from "./pages/ArticleDashboardPage/ArticleDashboardPage";

const App = () => (
  <Router>
    <Routes>
      <Route path="/"  element={<ArticleDashboardPage />} />
      <Route path="*"  element={<Navigate to="/" replace />} /> {/* catch-all redirect */}
    </Routes>
  </Router>
);
```

---

### Global Styles: `client/src/index.css`

All design tokens are defined as CSS custom properties on `:root` so any component can use them:

```css
:root {
  /* Brand colours */
  --color-primary:        #5b35d5;
  --color-primary-light:  #7c5ce8;
  --color-primary-dark:   #4527a0;

  /* Backgrounds */
  --color-bg-header: #2d2b3d;   /* dark purple header */
  --color-bg-main:   #f5f7fa;   /* light grey page bg */

  /* Status badge colours */
  --color-status-draft:         #f59e0b;
  --color-status-published:     #10b981;
  --color-status-review:        #6366f1;
  --color-status-archived:      #6b7280;

  /* Shadows */
  --shadow-card:    0 1px 3px rgba(0,0,0,0.08);
  --shadow-preview: 0 8px 32px rgba(0,0,0,0.14);

  /* Spacing tokens */
  --radius-sm: 4px;  --radius-md: 8px;  --radius-lg: 12px;

  /* Transitions */
  --transition-fast:   150ms ease;
  --transition-normal: 250ms ease;

  /* Typography scale */
  --font-size-xs: 11px;  --font-size-sm: 12px;
  --font-size-md: 14px;  --font-size-lg: 15px;
}
```

---

### Services Layer: `client/src/services/articleService.js`

All API calls go through a single Axios instance — one place to change the base URL or add auth headers.

```js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Fetch paginated list
export const fetchAllArticles = (params = {}) =>
  axiosInstance.get("/articles", { params }).then(r => r.data);

// Keyword search
export const searchArticlesByKeyword = (q, params = {}) =>
  axiosInstance.get("/articles/search", { params: { q, ...params } }).then(r => r.data);

// Single article — pass isPreview=true from hover to avoid inflating view count
export const fetchSingleArticle = (articleId, isPreview = true) =>
  axiosInstance.get(`/articles/${articleId}`, {
    params: isPreview ? { preview: "true" } : {},
  }).then(r => r.data);
```

---

## Pages

### `ArticleDashboardPage`

The single page of the app. Owns all top-level state and orchestrates child components.

**State managed:**

| State | Purpose |
|---|---|
| `articleList` | Array of articles currently displayed |
| `totalArticleCount` | Total from API (for count badge in header) |
| `currentPage` | Current pagination page |
| `hasMoreArticles` | Whether infinite scroll should fetch more |
| `isLoadingArticles` | Initial load spinner |
| `isLoadingMoreArticles` | Load-more spinner at bottom |
| `searchInputValue` | Controlled input value |
| `activeSearchKeyword` | Debounced keyword sent to API |
| `isSidebarOpen` | Mobile sidebar toggle |

**Key logic:**

```jsx
// Debounced search — waits 350ms after user stops typing
const handleSearchInputChange = (value) => {
  setSearchInputValue(value);
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    loadInitialArticles(value.trim()); // resets list, fetches page 1
  }, 350);
};

// Infinite scroll — IntersectionObserver in ArticleList fires this
const loadNextPageOfArticles = async () => {
  const nextPage = currentPage + 1;
  const newArticles = await fetchAllArticles({ page: nextPage, limit: 15 });
  setArticleList(prev => [...prev, ...newArticles.data]);
};
```

---

## Components

### `Header`
Top navigation bar containing:
- Hamburger menu toggle (opens NavigationSidebar)
- App logo / branding
- Search input (passes value up to `ArticleDashboardPage`)
- Article count badge
- Relevance sort control

### `NavigationSidebar`
Slide-in left sidebar for navigation links. Controlled by `isSidebarOpen` prop. Closes on backdrop click.

### `ArticleList`

The core list component. Responsibilities:
1. **Renders** `ArticleListItem` for each article
2. **Infinite scroll** via `IntersectionObserver` on a sentinel `<div>` at the bottom
3. **Hover preview orchestration** — manages which article's card is shown, fetches full details

```jsx
// IntersectionObserver setup
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && hasMoreArticles && !isLoadingMore) {
    onLoadMoreArticles(); // triggers page +1 fetch in parent
  }
}, { threshold: 0.1 });

observer.observe(sentinelRef.current);
```

### `ArticleListItem`

A single article row in the list. Uses a CSS Grid layout:

```
[ icon | title + meta          | date + actions ]
  28px   1fr (flexible)          auto
```

**Hover is scoped to the title only:**

```jsx
<span
  className="article-list-item-title article-list-item-title--hoverable"
  onMouseEnter={handleTitleMouseEnter}  // fires preview
  onMouseLeave={onMouseLeave}           // hides preview
>
  {articleData.title}
</span>
```

The title also gets a visual hint on hover:
```css
.article-list-item-title--hoverable:hover {
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: #c4b5fd; /* soft purple underline */
}
```

### `ArticlePreviewCard`

The hover popup card that appears to the **left** of the article row. Accepts:

| Prop | Type | Description |
|---|---|---|
| `articleData` | Object | Article data to display |
| `previewPositionX` | Number | `left` CSS value in px |
| `previewPositionY` | Number | `top` CSS value in px |
| `isLoading` | Boolean | Shows skeleton shimmer when fetching full details |

**Sections displayed:**
1. Header — status badge, type tag, article ID, title
2. Summary — article abstract
3. Resolution — step-by-step fix (when available)
4. Classification grid — Record Type, Language, Validation Status, Version, Visible To, Channels, Category, Total Views
5. Footer — Created By, Last Modified

**Loading skeleton** (shown while fetching full details):
```jsx
const SkeletonRow = ({ width, height = 12 }) => (
  <div className="apc-skeleton" style={{ width, height }} />
);
// CSS shimmer animation:
// background: linear-gradient(90deg, #f3f4f6 25%, #e9ecef 50%, #f3f4f6 75%);
// background-size: 200% 100%;
// animation: apcSkeletonShimmer 1.4s ease infinite;
```

**Animated loading bar** at the top of the card while the API call is in-flight:
```css
.apc-loading-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, #7c5ce8, #a78bfa, #7c5ce8);
  background-size: 200% 100%;
  animation: apcLoadingSlide 1.2s ease infinite;
}
```

### `StatusBadge`
Reusable pill component that maps status strings to colour variants using CSS classes.

---

## Hover Preview Feature

This is the most complex interaction in the app. Here is the full flow:

```
User moves mouse → hovers over article TITLE TEXT
        │
        │ (250ms delay timer starts)
        │
        ▼
ArticleListItem fires onMouseEnter(articleData, rowRect)
        │
        ▼
ArticleList.handleArticleItemMouseEnter()
  1. Compute card position (LEFT of row, aligned vertically)
  2. setHoveredArticleData(articleData)   ← show card immediately with list data
  3. setIsLoadingPreview(true)            ← start skeleton shimmer
  4. fetchSingleArticle(articleId, preview=true)  ← API call
        │
        ▼ (API response arrives)
  5. setHoveredArticleData(fullArticle)  ← hydrate card with full data
  6. setIsLoadingPreview(false)          ← stop shimmer
        │
User moves mouse AWAY from title
        │
        ▼
ArticleListItem fires onMouseLeave()
  → Clear timer, setHoveredArticleData(null), cancel inflight state
```

**Position calculation:**
```js
const computePosition = (itemRect) => {
  const vh   = window.innerHeight;
  const posX = itemRect.left - PREVIEW_CARD_WIDTH - 12; // always LEFT
  const posY = Math.max(8, Math.min(itemRect.top, vh - 520 - 8)); // clamped
  return { x: Math.max(8, posX), y: posY };
};
```

---

## API Reference

### `GET /api/health`
```json
{ "success": true, "message": "Knowbler API is running" }
```

### `GET /api/articles`
| Query Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | 1 | Page number |
| `limit` | number | 50 | Items per page |
| `status` | string | — | Filter by status |
| `category` | string | — | Filter by category |
| `type` | string | — | Filter by type |

**Response:**
```json
{
  "success": true,
  "data": [ ...articles ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 7,
    "totalArticles": 100,
    "articlesPerPage": 15
  }
}
```

### `GET /api/articles/search?q=keyword`
Same pagination params as above. Searches across `title`, `summary`, `category`, `type`, `articleId`, `createdBy`.

### `GET /api/articles/:id`
| Query Param | Value | Description |
|---|---|---|
| `preview` | `"true"` | Skips view count increment |

`:id` accepts either the MongoDB `_id` or the `articleId` string (e.g. `0000300001`).

**Response:**
```json
{
  "success": true,
  "data": { ...fullArticleObject }
}
```

---

## Running the Project

### Prerequisites
- Node.js 18+
- MongoDB running locally on port `27017`

### 1. Install dependencies

```powershell
# Backend
cd c:\Desktop\knowbler\server
npm install

# Frontend
cd c:\Desktop\knowbler\client
npm install
```

### 2. Seed the database (first time only)

```powershell
cd c:\Desktop\knowbler\server
npm run seed
```

### 3. Start the backend

```powershell
cd c:\Desktop\knowbler\server
npm run dev
# Server: http://localhost:5000
```

### 4. Start the frontend

```powershell
cd c:\Desktop\knowbler\client
npm run dev
# App: http://localhost:5173
```

---

## Available Scripts

### Server (`/server`)

| Script | Command | Description |
|---|---|---|
| `dev` | `node index.js` | Start the Express server |
| `seed` | `node seed.js` | Wipe DB and seed 100 articles |

### Client (`/client`)

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start Vite dev server with HMR |
| `build` | `vite build` | Production bundle |
| `preview` | `vite preview` | Preview production build locally |
| `lint` | `eslint .` | Run ESLint checks |

---

*Built with ❤️ — Knowbler Knowledge Dashboard*
