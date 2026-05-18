import React from "react";
import "./ArticlePreviewCard.css";

/* ── Icons ─────────────────────────────── */
const ArticleTypeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

/* ── Helpers ────────────────────────────── */
const formatArticleDate = (dateString) => {
  if (!dateString) return "—";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", {
    month: "short", day: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

const statusClass = (status = "") => {
  const s = status.toLowerCase();
  if (s === "published") return "published";
  if (s === "review")    return "review";
  if (s === "archived")  return "archived";
  return "draft";
};

/* ── Skeleton shimmer row ───────────────── */
const SkeletonRow = ({ width = "100%", height = 12, mb = 6 }) => (
  <div
    className="apc-skeleton"
    style={{ width, height, marginBottom: mb, borderRadius: 4 }}
  />
);

/* ── Main component ─────────────────────── */
const ArticlePreviewCard = ({ articleData, previewPositionX, previewPositionY, isLoading }) => {
  if (!articleData) return null;

  const cardStyle = {
    left: previewPositionX,
    top:  previewPositionY,
  };

  return (
    <div
      className="apc-card"
      style={cardStyle}
      role="tooltip"
      aria-label="Article preview"
    >
      {/* ── Header ─────────────────────────────── */}
      <div className="apc-header">
        <div className="apc-type-icon">
          <ArticleTypeIcon />
        </div>
        <div className="apc-header-meta">
          <div className="apc-badges">
            <span className={`apc-status-tag apc-status--${statusClass(articleData.status)}`}>
              {articleData.status}
            </span>
            <span className="apc-type-tag">{articleData.type}</span>
            <span className="apc-article-id">• {articleData.articleId}</span>
          </div>
          <div className="apc-title">{articleData.title}</div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────── */}
      <div className="apc-body">

        {/* Summary */}
        <div className="apc-section">
          <div className="apc-section-label">Summary</div>
          {isLoading ? (
            <>
              <SkeletonRow width="100%" />
              <SkeletonRow width="80%" mb={0} />
            </>
          ) : (
            <div className="apc-section-text">{articleData.summary || "—"}</div>
          )}
        </div>

        {/* Resolution */}
        {(isLoading || articleData.resolution) && (
          <div className="apc-section">
            <div className="apc-section-label">Resolution</div>
            {isLoading ? (
              <>
                <SkeletonRow width="100%" />
                <SkeletonRow width="100%" />
                <SkeletonRow width="65%" mb={0} />
              </>
            ) : (
              <div className="apc-section-text">{articleData.resolution}</div>
            )}
          </div>
        )}

        {/* Classification grid */}
        <div className="apc-section-label apc-classification-label">Classification</div>
        <div className="apc-grid">
          <MetaItem label="Record Type"        value={articleData.type}       loading={isLoading} />
          <MetaItem label="Language"           value={articleData.language}   loading={isLoading} />
          <MetaItem label="Validation Status"  value={articleData.status}     loading={isLoading} />
          <MetaItem label="Version"            value={articleData.version}    loading={isLoading} />
          <MetaItem
            label="Visible To"
            value={Array.isArray(articleData.visibility)
              ? articleData.visibility.join(", ")
              : articleData.visibility}
            loading={isLoading}
          />
          <MetaItem
            label="Channels"
            value={Array.isArray(articleData.channels)
              ? articleData.channels.join(", ")
              : articleData.channels}
            loading={isLoading}
          />
          <MetaItem label="Category"    value={articleData.category}  loading={isLoading} />
          <MetaItem label="Total Views" value={articleData.views}     loading={isLoading} />
        </div>
      </div>

      {/* ── Footer ─────────────────────────────── */}
      <div className="apc-footer">
        <MetaItem label="Created By"    value={articleData.createdBy}               loading={isLoading} />
        <MetaItem label="Last Modified" value={formatArticleDate(articleData.updatedAt)} loading={isLoading} />
      </div>

      {/* Subtle loading bar at top */}
      {isLoading && <div className="apc-loading-bar" />}
    </div>
  );
};

/* ── Helper sub-component ───────────────── */
const MetaItem = ({ label, value, loading }) => (
  <div className="apc-meta-item">
    <span className="apc-meta-label">{label}</span>
    {loading
      ? <SkeletonRow width="70%" mb={0} />
      : <span className="apc-meta-value">{value ?? "—"}</span>
    }
  </div>
);

export default ArticlePreviewCard;
