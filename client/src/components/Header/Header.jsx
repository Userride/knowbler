import React from "react";
import "./Header.css";

import { Menu, Globe, ChevronRight, ArrowLeftRight, Search, ArrowDownUp, Edit2 } from "lucide-react";
import logoIcon from "../../assets/logo-icon.svg";
import gridIcon from "../../assets/grid-icon.svg";
import articleIcon from "../../assets/article-icon.svg";

/* ── Component ─────────────────────────────── */
const Header = ({ onMenuToggle, searchInputValue, onSearchChange, totalArticleCount }) => {
  const displayCount = totalArticleCount > 999
    ? `${Math.round(totalArticleCount / 1000)}k`
    : totalArticleCount;

  return (
    <header className="header-container">

      {/* ── ROW 1: Logo bar ─────────────────── */}
      <div className="header-logo-bar">
        <div className="header-logo-bar-left">
          <button
            className="header-menu-button"
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
          >
            <Menu size={16} />
          </button>
          <div className="header-logo-wrapper" aria-label="Knowbler home">
            <div className="header-logo-icon">
              <img src={logoIcon} alt="logo" />
            </div>
          </div>
        </div>
        <div className="header-logo-bar-right">
          <button className="header-top-icon-button" aria-label="Grid view">
            <img src={gridIcon} alt="grid" />
          </button>
          <button className="header-top-icon-button" aria-label="Language">
            <Globe size={16} />
          </button>
        </div>
      </div>

      {/* ── ROW 2: Active Case bar ─────────── */}
      <div className="header-case-bar">
        <div className="header-case-bar-left">
          <span className="header-case-label">Active Case</span>
          <span className="header-case-number">#00001120</span>
          <span className="header-case-dot">·</span>
          <button className="header-related-articles-button" aria-label="Related articles">
            <span>Related Articles</span>
            <span className="header-related-count-badge">4</span>
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="header-case-bar-right">
          <button className="header-switch-button" aria-label="Switch view">
            <ArrowLeftRight size={14} />
            Switch
          </button>
        </div>
      </div>

      {/* ── ROW 3: Search bar ─────────────── */}
      <div className="header-search-bar">
        <div className="header-search-bar-left">
          <span className="header-search-article-icon" aria-hidden="true">
            <img src={articleIcon} alt="article" />
          </span>
          <div className="header-search-input-wrapper">
            <span className="header-search-magnifier">
              <Search size={14} />
            </span>
            <input
              id="article-search-input"
              type="text"
              className="header-search-input"
              placeholder="Search in All Articles..."
              value={searchInputValue}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search all articles"
            />
          </div>
        </div>

        <div className="header-search-bar-right">
          <div className="header-count-group">
            <span>All</span>
            <span className="header-count-number">{displayCount}</span>
          </div>
          <div className="header-divider" aria-hidden="true" />
          <button className="header-relevance-button" aria-label="Sort by relevance">
            <ArrowDownUp size={14} />
            Relevance
          </button>
          <div className="header-divider" aria-hidden="true" />
          <button className="header-search-icon-button" aria-label="Edit">
            <Edit2 size={16} />
          </button>
          <button className="header-search-icon-button" aria-label="Language settings">
            <Globe size={16} />
          </button>
        </div>
      </div>

    </header>
  );
};

export default Header;
