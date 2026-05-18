import React from "react";
import "./Header.css";

import menuIcon from "../../assets/menu-icon.svg";
import logoIcon from "../../assets/logo-icon.svg";
import gridIcon from "../../assets/grid-icon.svg";
import globeIcon from "../../assets/globe-icon.svg";
import chevronRightIcon from "../../assets/chevron-right-icon.svg";
import switchIcon from "../../assets/switch-icon.svg";
import searchIcon from "../../assets/search-icon.svg";
import articleIcon from "../../assets/article-icon.svg";
import sortIcon from "../../assets/sort-icon.svg";
import editIcon from "../../assets/edit-icon.svg";

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
            <img src={menuIcon} alt="menu" />
          </button>
          <div className="header-logo-wrapper" aria-label="Knowbler home">
            <div className="header-logo-icon">
              <img src={logoIcon} alt="logo" />
            </div>
            <span className="header-logo-text">knowbler</span>
          </div>
        </div>
        <div className="header-logo-bar-right">
          <button className="header-top-icon-button" aria-label="Grid view">
            <img src={gridIcon} alt="grid" />
          </button>
          <button className="header-top-icon-button" aria-label="Language">
            <img src={globeIcon} alt="language" />
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
            <img src={chevronRightIcon} alt="chevron right" />
          </button>
        </div>
        <div className="header-case-bar-right">
          <button className="header-switch-button" aria-label="Switch view">
            <img src={switchIcon} alt="switch" />
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
              <img src={searchIcon} alt="search" />
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
            <img src={sortIcon} alt="sort" />
            Relevance
          </button>
          <div className="header-divider" aria-hidden="true" />
          <button className="header-search-icon-button" aria-label="Edit">
            <img src={editIcon} alt="edit" />
          </button>
          <button className="header-search-icon-button" aria-label="Language settings">
            <img src={globeIcon} alt="language" />
          </button>
        </div>
      </div>

    </header>
  );
};

export default Header;
