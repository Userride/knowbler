import React from "react";
import "./Header.css";

/* ── Icons ─────────────────────────────────── */
const MenuIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const LogoIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const SwitchIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
    <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ArticleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const SortIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
  </svg>
);

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

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
            <MenuIcon />
          </button>
          <div className="header-logo-wrapper" aria-label="Knowbler home">
            <div className="header-logo-icon">
              <LogoIcon />
            </div>
            <span className="header-logo-text">knowbler</span>
          </div>
        </div>
        <div className="header-logo-bar-right">
          <button className="header-top-icon-button" aria-label="Grid view">
            <GridIcon />
          </button>
          <button className="header-top-icon-button" aria-label="Language">
            <GlobeIcon />
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
            <ChevronRightIcon />
          </button>
        </div>
        <div className="header-case-bar-right">
          <button className="header-switch-button" aria-label="Switch view">
            <SwitchIcon />
            Switch
          </button>
        </div>
      </div>

      {/* ── ROW 3: Search bar ─────────────── */}
      <div className="header-search-bar">
        <div className="header-search-bar-left">
          <span className="header-search-article-icon" aria-hidden="true">
            <ArticleIcon />
          </span>
          <div className="header-search-input-wrapper">
            <span className="header-search-magnifier">
              <SearchIcon />
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
            <SortIcon />
            Relevance
          </button>
          <div className="header-divider" aria-hidden="true" />
          <button className="header-search-icon-button" aria-label="Edit">
            <EditIcon />
          </button>
          <button className="header-search-icon-button" aria-label="Language settings">
            <GlobeIcon />
          </button>
        </div>
      </div>

    </header>
  );
};

export default Header;
