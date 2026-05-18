import React, { useRef } from "react";
import "./ArticleListItem.css";

const DocumentIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
  </svg>
);

const formatDisplayDate = (dateString) => {
  if (!dateString) return "—";
  const dateObj = new Date(dateString);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[dateObj.getMonth()];
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = String(dateObj.getFullYear()).slice(-2);
  const hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${month} ${day}, ${year}, ${String(displayHour).padStart(2, "0")}:${minutes} ${ampm}`;
};

const ArticleListItem = ({ articleData, onMouseEnter, onMouseLeave }) => {
  const itemRef  = useRef(null);
  const titleRef = useRef(null);

  const handleTitleMouseEnter = () => {
    if (!itemRef.current) return;
    // Use the row's rect for positioning, but only fire when over the title
    const itemRect = itemRef.current.getBoundingClientRect();
    onMouseEnter(articleData, itemRect);
  };

  return (
    <div
      ref={itemRef}
      className="article-list-item"
      role="listitem"
      aria-label={`Article: ${articleData.title}`}
    >
      <div className="article-list-item-icon-col">
        <div className="article-list-item-type-icon">
          <DocumentIcon />
        </div>
      </div>

      <div className="article-list-item-content-col">
        <div className="article-list-item-title-row">
          {/* ↓ Hover events are ONLY on the title text */}
          <span
            ref={titleRef}
            className="article-list-item-title article-list-item-title--hoverable"
            title={articleData.title}
            onMouseEnter={handleTitleMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {articleData.title}
          </span>
        </div>
        <div className="article-list-item-meta-row">
          <span className="article-list-item-category">{articleData.category}</span>
          <span className="article-list-item-separator">•</span>
          <span className="article-list-item-id">{articleData.articleId}</span>
        </div>
      </div>

      <div className="article-list-item-date-col">
        <div className="article-list-item-date">
          <CalendarIcon />
          <span>{formatDisplayDate(articleData.updatedAt || articleData.createdAt)}</span>
        </div>
        <div className="article-list-item-actions">
          <button className="article-list-action-button" aria-label="More options">
            <MoreIcon />
          </button>
        </div>
        <button className="article-list-item-info-button" aria-label="Article info">
          <InfoIcon />
        </button>
      </div>
    </div>
  );
};

export default ArticleListItem;
