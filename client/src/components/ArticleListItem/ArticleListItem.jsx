import React, { useRef } from "react";
import "./ArticleListItem.css";

import { Calendar, Info, MoreHorizontal } from "lucide-react";
import documentIcon from "../../assets/document-icon.svg";

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
          <img src={documentIcon} alt="document" />
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
          <Calendar size={11} />
          <span>{formatDisplayDate(articleData.updatedAt || articleData.createdAt)}</span>
        </div>
        <div className="article-list-item-actions">
          <button className="article-list-action-button" aria-label="More options">
            <MoreHorizontal size={13} />
          </button>
        </div>
        <button className="article-list-item-info-button" aria-label="Article info">
          <Info size={13} />
        </button>
      </div>
    </div>
  );
};

export default ArticleListItem;
