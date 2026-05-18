import React, { useState, useRef, useEffect } from "react";
import ArticleListItem from "../ArticleListItem/ArticleListItem";
import ArticlePreviewCard from "../ArticlePreviewCard/ArticlePreviewCard";
import { fetchSingleArticle } from "../../services/articleService";
import "./ArticleList.css";

import alertIcon from "../../assets/alert-icon.svg";
import emptySearchIcon from "../../assets/empty-search-icon.svg";

/* ── Constants ──────────────────────────── */
const PREVIEW_CARD_WIDTH  = 360;
const PREVIEW_CARD_HEIGHT = 520;
const PREVIEW_CARD_OFFSET = 12;
const HOVER_DELAY_MS      = 250;

/* ── Component ──────────────────────────── */
const ArticleList = ({
  articleList,
  isLoadingArticles,
  isLoadingMoreArticles,
  hasMoreArticles,
  articleFetchError,
  onRetryFetch,
  onLoadMoreArticles,
}) => {
  const [hoveredArticleData,  setHoveredArticleData]  = useState(null);
  const [isLoadingPreview,    setIsLoadingPreview]    = useState(false);
  const [previewCardPosition, setPreviewCardPosition] = useState({ x: 0, y: 0 });

  const hoverTimerRef               = useRef(null);
  const activeHoverIdRef            = useRef(null);
  const infiniteScrollSentinelRef   = useRef(null);
  const observerRef                 = useRef(null);

  /* ── IntersectionObserver — triggers next page load ── */
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const sentinelEntry = entries[0];
        if (sentinelEntry.isIntersecting && hasMoreArticles && !isLoadingMoreArticles) {
          onLoadMoreArticles();
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    if (infiniteScrollSentinelRef.current) {
      observerRef.current.observe(infiniteScrollSentinelRef.current);
    }

    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [hasMoreArticles, isLoadingMoreArticles, onLoadMoreArticles]);

  /* ── Compute card position — always LEFT of the article row ── */
  const computePosition = (itemRect) => {
    const vh = window.innerHeight;

    // Always position to the LEFT of the article row
    const posX = itemRect.left - PREVIEW_CARD_WIDTH - PREVIEW_CARD_OFFSET;

    // Vertically align with the top of the hovered row; clamp so card
    // doesn't overflow below the viewport
    const rawY = itemRect.top;
    const posY = Math.max(8, Math.min(rawY, vh - PREVIEW_CARD_HEIGHT - 8));

    return { x: Math.max(8, posX), y: posY };
  };

  /* ── Hover preview handlers ─────────────────────────── */
  const handleArticleItemMouseEnter = (articleData, itemRect) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

    // Show stub immediately so user gets visual feedback, then enrich with full data
    const pos = computePosition(itemRect);
    activeHoverIdRef.current = articleData._id || articleData.articleId;

    hoverTimerRef.current = setTimeout(async () => {
      const currentId = activeHoverIdRef.current;

      // Show the card right away with list data (no flicker)
      setPreviewCardPosition(pos);
      setHoveredArticleData(articleData);
      setIsLoadingPreview(true);

      try {
        const response = await fetchSingleArticle(articleData.articleId || articleData._id);
        // Only update if the user is still hovering over the same item
        if (activeHoverIdRef.current === currentId && response?.data) {
          setHoveredArticleData(response.data);
        }
      } catch {
        // Keep showing list data if fetch fails — no-op
      } finally {
        if (activeHoverIdRef.current === currentId) {
          setIsLoadingPreview(false);
        }
      }
    }, HOVER_DELAY_MS);
  };

  const handleArticleItemMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    activeHoverIdRef.current = null;
    setHoveredArticleData(null);
    setIsLoadingPreview(false);
  };

  /* ── Initial loading state ──────────────────────────── */
  if (isLoadingArticles) {
    return (
      <div className="article-list-container">
        <div className="article-list-loading-state" role="status" aria-label="Loading articles">
          <div className="article-list-loading-spinner" />
          <span className="article-list-loading-text">Loading articles...</span>
        </div>
      </div>
    );
  }

  /* ── Error state ────────────────────────────────────── */
  if (articleFetchError) {
    return (
      <div className="article-list-container">
        <div className="article-list-error-state" role="alert">
          <div className="article-list-error-icon"><img src={alertIcon} alt="alert" /></div>
          <div className="article-list-error-title">Failed to load articles</div>
          <div className="article-list-error-message">{articleFetchError}</div>
          <button className="article-list-error-retry-button" onClick={onRetryFetch}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ── Empty state ────────────────────────────────────── */
  if (!articleList || articleList.length === 0) {
    return (
      <div className="article-list-container">
        <div className="article-list-empty-state">
          <div className="article-list-empty-icon"><img src={emptySearchIcon} alt="empty" /></div>
          <div className="article-list-empty-title">No articles found</div>
          <div className="article-list-empty-message">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </div>
        </div>
      </div>
    );
  }

  /* ── Main list ──────────────────────────────────────── */
  return (
    <div className="article-list-container" role="list">
      <div className="article-list-items-wrapper">
        {articleList.map((articleData) => (
          <ArticleListItem
            key={articleData._id || articleData.articleId}
            articleData={articleData}
            onMouseEnter={handleArticleItemMouseEnter}
            onMouseLeave={handleArticleItemMouseLeave}
          />
        ))}
      </div>

      {/* ── Infinite scroll sentinel ─────────────────── */}
      <div
        ref={infiniteScrollSentinelRef}
        className="article-list-scroll-sentinel"
        aria-hidden="true"
      />

      {/* ── Load-more spinner ────────────────────────── */}
      {isLoadingMoreArticles && (
        <div className="article-list-load-more-spinner" role="status" aria-label="Loading more articles">
          <div className="article-list-loading-spinner article-list-loading-spinner--small" />
          <span className="article-list-load-more-text">Loading more articles...</span>
        </div>
      )}

      {/* ── End of list message ──────────────────────── */}
      {!hasMoreArticles && articleList.length > 0 && (
        <div className="article-list-end-message">
          All {articleList.length} article{articleList.length !== 1 ? "s" : ""} loaded
        </div>
      )}

      {/* ── Hover preview card ───────────────────────── */}
      {hoveredArticleData && (
        <ArticlePreviewCard
          articleData={hoveredArticleData}
          previewPositionX={previewCardPosition.x}
          previewPositionY={previewCardPosition.y}
          isLoading={isLoadingPreview}
        />
      )}
    </div>
  );
};

export default ArticleList;
